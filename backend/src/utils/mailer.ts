import nodemailer from 'nodemailer';
import { getSmtpConfig } from '../modules/settings/config.service';

/**
 * Sends an email using dynamic SMTP settings from the database (with .env fallback).
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const config = await getSmtpConfig();

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"SoufSim" <${config.from}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
