import { Queue, Worker, Job } from 'bullmq';
import { redisConnection, DEFAULT_JOB_OPTIONS } from './queue.config';
import { sendEmail } from '../utils/mailer';

// ─── Job Payload Types ───────────────────────────────────────────────────────

export interface WelcomeEmailJob {
  type: 'welcome';
  to: string;
  name: string;
}

export interface OrderConfirmationEmailJob {
  type: 'order_confirmation';
  to: string;
  name: string;
  orderId: string;
  planName: string;
  amount: string;
  currency: string;
  qrCodeUrl?: string;
}

export interface ESimActivatedEmailJob {
  type: 'esim_activated';
  to: string;
  name: string;
  iccid: string;
  planName: string;
  country: string;
  dataLimit: string;
  validUntil: string;
  qrCodeUrl?: string;
}

export interface DataLowAlertEmailJob {
  type: 'data_low_alert';
  to: string;
  name: string;
  iccid: string;
  remainingMb: number;
  planName: string;
}

export interface ESimExpiringSoonEmailJob {
  type: 'esim_expiring_soon';
  to: string;
  name: string;
  iccid: string;
  planName: string;
  expiresAt: string;
  daysLeft: number;
}

export interface ResetPasswordEmailJob {
  type: 'reset_password';
  to: string;
  name: string;
  resetUrl: string;
}

export type EmailJobPayload =
  | WelcomeEmailJob
  | OrderConfirmationEmailJob
  | ESimActivatedEmailJob
  | DataLowAlertEmailJob
  | ESimExpiringSoonEmailJob
  | ResetPasswordEmailJob;

// ─── Queue Instance ───────────────────────────────────────────────────────────

export const emailQueue = new Queue<EmailJobPayload>('email', {
  connection: redisConnection,
  defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

// ─── HTML Template Builders ───────────────────────────────────────────────────

function baseTemplate(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${previewText}</title>
  <style>
    body { margin:0; padding:0; background:#0d0d14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .container { max-width:600px; margin:0 auto; background:#111120; border-radius:16px; overflow:hidden; }
    .header { background:linear-gradient(135deg,#0891b2,#3b82f6); padding:32px; text-align:center; }
    .header h1 { color:#fff; margin:0; font-size:24px; font-weight:800; }
    .header p { color:rgba(255,255,255,0.7); margin:8px 0 0; font-size:14px; }
    .body { padding:32px; }
    .card { background:#1e1e30; border-radius:12px; padding:20px; margin:16px 0; border:1px solid rgba(255,255,255,0.06); }
    .label { color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px; }
    .value { color:#e2e8f0; font-size:16px; font-weight:600; }
    .btn { display:inline-block; background:linear-gradient(135deg,#06b6d4,#3b82f6); color:#fff; text-decoration:none; padding:14px 32px; border-radius:10px; font-weight:700; font-size:15px; margin:16px 0; }
    .footer { padding:24px 32px; border-top:1px solid rgba(255,255,255,0.06); text-align:center; color:#475569; font-size:12px; }
    .badge { display:inline-block; padding:4px 12px; border-radius:100px; font-size:12px; font-weight:600; }
    .badge-success { background:#064e3b; color:#34d399; }
    .badge-warning { background:#451a03; color:#fb923c; }
    .divider { border:none; border-top:1px solid rgba(255,255,255,0.06); margin:20px 0; }
    .qr-box { text-align:center; padding:20px; background:#0d0d14; border-radius:12px; margin:16px 0; }
    .qr-box img { max-width:200px; border-radius:8px; }
  </style>
</head>
<body style="background:#0d0d14; padding:24px;">
  <div class="container">
    ${content}
    <div class="footer">
      <p>SoufSim • The smarter way to stay connected</p>
      <p style="margin-top:8px;">© ${new Date().getFullYear()} SoufSim. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

function welcomeHtml(name: string): string {
  return baseTemplate(
    `
    <div class="header">
      <h1>🌍 Welcome to SoufSim!</h1>
      <p>Your global eSIM journey starts here</p>
    </div>
    <div class="body">
      <p style="color:#94a3b8; font-size:16px;">Hi <strong style="color:#e2e8f0;">${name}</strong>,</p>
      <p style="color:#94a3b8;">Welcome to <strong style="color:#06b6d4;">SoufSim</strong> — the easiest way to stay connected worldwide with instant eSIM activation.</p>
      <div class="card">
        <p style="color:#e2e8f0; font-weight:700; margin-top:0;">🚀 Getting started is simple:</p>
        <p style="color:#94a3b8; margin:8px 0;">1. Browse our global eSIM plans</p>
        <p style="color:#94a3b8; margin:8px 0;">2. Choose your destination country</p>
        <p style="color:#94a3b8; margin:8px 0;">3. Pay & get your QR code instantly</p>
        <p style="color:#94a3b8; margin:8px 0;">4. Scan & travel connected! ✈️</p>
      </div>
      <center><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/plans" class="btn">Browse eSIM Plans →</a></center>
    </div>`,
    'Welcome to SoufSim!'
  );
}

function orderConfirmationHtml(job: OrderConfirmationEmailJob): string {
  return baseTemplate(
    `
    <div class="header">
      <h1>✅ Order Confirmed!</h1>
      <p>Your eSIM is being activated</p>
    </div>
    <div class="body">
      <p style="color:#94a3b8;">Hi <strong style="color:#e2e8f0;">${job.name}</strong>, your order has been confirmed!</p>
      <div class="card">
        <div style="margin-bottom:12px;"><div class="label">Order ID</div><div class="value" style="font-family:monospace;color:#06b6d4;">#${job.orderId}</div></div>
        <hr class="divider"/>
        <div style="margin-bottom:12px;"><div class="label">Plan</div><div class="value">${job.planName}</div></div>
        <div><div class="label">Amount Paid</div><div class="value">${job.amount} ${job.currency}</div></div>
      </div>
      ${job.qrCodeUrl ? `<div class="qr-box"><p style="color:#94a3b8;margin-top:0;">Your eSIM QR Code</p><img src="${job.qrCodeUrl}" alt="eSIM QR Code"/><p style="color:#64748b;font-size:12px;">Scan this with your phone's camera to activate your eSIM</p></div>` : ''}
      <center><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/orders" class="btn">View Order Details →</a></center>
    </div>`,
    'Your SoufSim Order is Confirmed'
  );
}

function esimActivatedHtml(job: ESimActivatedEmailJob): string {
  return baseTemplate(
    `
    <div class="header">
      <h1>📱 eSIM Activated!</h1>
      <p>You're ready to connect in ${job.country}</p>
    </div>
    <div class="body">
      <p style="color:#94a3b8;">Hi <strong style="color:#e2e8f0;">${job.name}</strong>, your eSIM is now active and ready to use!</p>
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div class="label">Status</div>
          <span class="badge badge-success">● Active</span>
        </div>
        <hr class="divider"/>
        <div style="margin-bottom:12px;"><div class="label">ICCID</div><div class="value" style="font-family:monospace;font-size:13px;">${job.iccid}</div></div>
        <div style="margin-bottom:12px;"><div class="label">Plan</div><div class="value">${job.planName}</div></div>
        <div style="margin-bottom:12px;"><div class="label">Data Allowance</div><div class="value">${job.dataLimit}</div></div>
        <div><div class="label">Valid Until</div><div class="value">${job.validUntil}</div></div>
      </div>
      ${job.qrCodeUrl ? `<div class="qr-box"><p style="color:#94a3b8;margin-top:0;">Activation QR Code</p><img src="${job.qrCodeUrl}" alt="eSIM QR"/></div>` : ''}
      <div class="card" style="background:#0d0d14;">
        <p style="color:#94a3b8;margin:0;font-size:14px;"><strong style="color:#06b6d4;">💡 Tip:</strong> Go to Settings → Cellular → Add eSIM on your device, then scan the QR code above.</p>
      </div>
    </div>`,
    'Your SoufSim eSIM is Activated!'
  );
}

function dataLowAlertHtml(job: DataLowAlertEmailJob): string {
  return baseTemplate(
    `
    <div class="header" style="background:linear-gradient(135deg,#b45309,#92400e);">
      <h1>⚠️ Low Data Alert</h1>
      <p>Only ${job.remainingMb}MB remaining on your eSIM</p>
    </div>
    <div class="body">
      <p style="color:#94a3b8;">Hi <strong style="color:#e2e8f0;">${job.name}</strong>,</p>
      <p style="color:#94a3b8;">Your eSIM is running low on data. Don't get disconnected!</p>
      <div class="card">
        <div style="margin-bottom:12px;"><div class="label">Plan</div><div class="value">${job.planName}</div></div>
        <div><div class="label">Remaining Data</div><div class="value" style="color:#fb923c;">${job.remainingMb} MB</div></div>
      </div>
      <center><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/esims" class="btn" style="background:linear-gradient(135deg,#b45309,#d97706);">Top Up Data →</a></center>
    </div>`,
    'Low Data Warning — SoufSim'
  );
}

function expiringHtml(job: ESimExpiringSoonEmailJob): string {
  return baseTemplate(
    `
    <div class="header" style="background:linear-gradient(135deg,#7c3aed,#4f46e5);">
      <h1>⏳ eSIM Expiring Soon</h1>
      <p>${job.daysLeft} day${job.daysLeft !== 1 ? 's' : ''} remaining</p>
    </div>
    <div class="body">
      <p style="color:#94a3b8;">Hi <strong style="color:#e2e8f0;">${job.name}</strong>,</p>
      <p style="color:#94a3b8;">Your eSIM plan is expiring soon. Renew now to stay connected!</p>
      <div class="card">
        <div style="margin-bottom:12px;"><div class="label">Plan</div><div class="value">${job.planName}</div></div>
        <div style="margin-bottom:12px;"><div class="label">Expires On</div><div class="value" style="color:#c084fc;">${job.expiresAt}</div></div>
        <div><div class="label">Days Left</div><div class="value">${job.daysLeft} day${job.daysLeft !== 1 ? 's' : ''}</div></div>
      </div>
      <center><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/plans" class="btn" style="background:linear-gradient(135deg,#7c3aed,#4f46e5);">Renew Plan →</a></center>
    </div>`,
    'Your SoufSim eSIM is Expiring Soon'
  );
}

function resetPasswordHtml(job: ResetPasswordEmailJob): string {
  return baseTemplate(
    `
    <div class="header">
      <h1>🔐 Reset Your Password</h1>
      <p>We received a request to reset your SoufSim password</p>
    </div>
    <div class="body">
      <p style="color:#94a3b8;">Hi <strong style="color:#e2e8f0;">${job.name}</strong>,</p>
      <p style="color:#94a3b8;">Click the button below to reset your password. This link expires in 1 hour.</p>
      <center><a href="${job.resetUrl}" class="btn">Reset Password →</a></center>
      <div class="card" style="background:#0d0d14;">
        <p style="color:#64748b;margin:0;font-size:12px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      </div>
    </div>`,
    'Reset Your SoufSim Password'
  );
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export const emailWorker = new Worker<EmailJobPayload>(
  'email',
  async (job: Job<EmailJobPayload>) => {
    const data = job.data;
    let subject = '';
    let html = '';

    switch (data.type) {
      case 'welcome':
        subject = '🌍 Welcome to SoufSim — Your Global eSIM Platform';
        html = welcomeHtml(data.name);
        break;
      case 'order_confirmation':
        subject = `✅ Order Confirmed — ${data.planName}`;
        html = orderConfirmationHtml(data);
        break;
      case 'esim_activated':
        subject = `📱 Your SoufSim eSIM is Active — ${data.country}`;
        html = esimActivatedHtml(data);
        break;
      case 'data_low_alert':
        subject = `⚠️ Low Data Alert — ${data.remainingMb}MB remaining`;
        html = dataLowAlertHtml(data);
        break;
      case 'esim_expiring_soon':
        subject = `⏳ eSIM Expiring in ${data.daysLeft} day(s) — Renew Now`;
        html = expiringHtml(data);
        break;
      case 'reset_password':
        subject = '🔐 Reset Your SoufSim Password';
        html = resetPasswordHtml(data);
        break;
    }

    await sendEmail(data.to, subject, html);
    console.log(`[emailQueue] Sent "${data.type}" email to ${data.to}`);
  },
  { connection: redisConnection, concurrency: 5 }
);

emailWorker.on('failed', (job, err) => {
  console.error(`[emailQueue] Job ${job?.id} failed:`, err.message);
});

// ─── Helper: Enqueue emails ───────────────────────────────────────────────────

export const enqueueEmail = (payload: EmailJobPayload, delay = 0) =>
  emailQueue.add(payload.type, payload, {
    ...DEFAULT_JOB_OPTIONS,
    delay,
  });
