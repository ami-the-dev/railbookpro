import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  if (!user) {
    throw new Error("Email not configured. Set GMAIL_USER or SMTP_USER in .env.local");
  }

  if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });
  }

  const pass = process.env.SMTP_PASS;
  if (!pass) {
    throw new Error("Email not configured. Set GMAIL_CLIENT_ID/GMAIL_CLIENT_SECRET/GMAIL_REFRESH_TOKEN for OAuth2, or SMTP_PASS for password auth.");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    requireTLS: !(process.env.SMTP_SECURE === "true"),
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
}

export async function verifySmtpConfig(): Promise<string> {
  const transporter = getTransporter();
  return new Promise((resolve, reject) => {
    transporter.verify((err) => {
      if (err) reject(err);
      else resolve("SMTP connection verified");
    });
  });
}

export async function sendResetPasswordEmail(to: string, token: string) {
  const transporter = getTransporter();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const fromUser = process.env.GMAIL_USER || process.env.SMTP_USER || "noreply@railbookpro.in";
  const resetUrl = `${appUrl}/auth/reset-password/${token}`;

  console.log(`[Email] Sending reset email to ${to} via ${fromUser} (appUrl=${appUrl})`);

  await transporter.sendMail({
    from: `"RailBookPro" <${fromUser}>`,
    to,
    subject: "Reset your RailBookPro password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="text-align: center; padding: 24px 0;">
          <h1 style="color: #1a73e8; margin: 0;">RailBookPro</h1>
        </div>
        <div style="background: #f9fafb; border-radius: 8px; padding: 32px;">
          <h2 style="margin-top: 0;">Reset your password</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            We received a request to reset your password. Click the button below to choose a new one.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" style="background: #1a73e8; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 6px; display: inline-block; font-weight: 600;">
              Reset Password
            </a>
          </div>
          <p style="color: #6b7280; font-size: 13px;">
            This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; padding-top: 16px;">
          RailBookPro &bull; Your Railway Booking Platform
        </p>
      </div>
    `,
  });

  console.log(`[Email] Reset email sent successfully to ${to}`);
}
