import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from './utils/passport';
import { connectRedis } from './utils/redis';
import authRoutes from './modules/auth/auth.routes';
import countriesRoutes from './modules/countries/countries.routes';
import plansRoutes from './modules/plans/plans.routes';
import ordersRoutes from './modules/orders/orders.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import adminRoutes from './modules/admin/admin.routes';
import kycRoutes from './modules/kyc/kyc.routes';
import settingsRoutes from './modules/settings/settings.routes';
import checkoutRoutes from './modules/checkout/checkout.routes';
import partnerRoutes from './modules/partner/partner.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { User } from '@soufsim-clone/shared';
import path from 'path';
import { apiLimiter, publicLimiter } from './middleware/rateLimiter';
import { registerSocketServer } from './services/notification.service';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// ─── Socket.io ────────────────────────────────────────────────────────────────

const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  // Client sends their userId after connecting
  socket.on('join', (userId: string) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`[Socket] User ${userId} joined their room.`);
    }
  });
  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

registerSocketServer(io);

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(helmet());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GoSIM Partner API',
      version: '1.0.0',
      description:
        'API for GoSIM Partners and Resellers to manage eSIMs, Orders, and Webhooks.',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./src/modules/partner/*.routes.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs/spec.json', (req, res) => res.json(swaggerSpec));

// Webhooks require RAW body for signature verification
app.use(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentsRoutes
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', publicLimiter, authRoutes);
app.use('/api/countries', publicLimiter, countriesRoutes);
app.use('/api/plans', publicLimiter, plansRoutes);

// Protected endpoints limit
app.use('/api/orders', apiLimiter, ordersRoutes);
app.use('/api/payments', apiLimiter, paymentsRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/admin/settings', apiLimiter, settingsRoutes);
app.use('/api/kyc', apiLimiter, kycRoutes);
app.use('/api/checkout', apiLimiter, checkoutRoutes);
app.use('/api/notifications', apiLimiter, notificationsRoutes);
app.use('/v1/partner', partnerRoutes);

// Expose static local uploads statically so clients can load the Passport Image via HTTP later
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  const dummyUser: User = {
    id: '1',
    name: 'Test SoufSim',
    email: 'test@soufsim.com',
    createdAt: new Date(),
  };
  res.json({ message: 'Welcome to SoufSim Clone API', user: dummyUser });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

httpServer.listen(PORT, async () => {
  await connectRedis();

  // Start queue workers
  await import('./queues/emailQueue');
  await import('./queues/provisioningQueue');
  await import('./queues/pushQueue');
  await import('./queues/webhookQueue');

  // Start cron jobs
  await import('./jobs/scheduledJobs');

  console.log(`[server]: Server is running at http://localhost:${PORT}`);
  console.log(`[server]: WebSocket server ready on ws://localhost:${PORT}`);
});
