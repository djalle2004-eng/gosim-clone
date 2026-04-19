import 'dotenv/config';
import express from 'express';
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
import { User } from '@soufsim-clone/shared';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(helmet());

// Webhooks require RAW body for signature verification
app.use(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentsRoutes
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/countries', countriesRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/kyc', kycRoutes);

// Expose static local uploads statically so clients can load the Passport Image via HTTP later
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  // Example of using shared type
  const dummyUser: User = {
    id: '1',
    name: 'Test SoufSim',
    email: 'test@soufsim.com',
    createdAt: new Date(),
  };
  res.json({ message: 'Welcome to SoufSim Clone API', user: dummyUser });
});

app.listen(PORT, async () => {
  await connectRedis();
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
