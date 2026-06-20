export interface NotificationPayload {
  to: string;
  subject: string;
  message: string;
  type: "email" | "sms";
}

const emailLog: NotificationPayload[] = [];
const smsLog: NotificationPayload[] = [];

export function sendEmail(to: string, subject: string, message: string) {
  const payload: NotificationPayload = { to, subject, message, type: "email" };
  emailLog.push(payload);
  console.log(`[EMAIL] To: ${to} | Subject: ${subject} | Message: ${message}`);
  return { success: true, id: `email_${Date.now()}` };
}

export function sendSMS(to: string, message: string) {
  const payload: NotificationPayload = { to, subject: "", message, type: "sms" };
  smsLog.push(payload);
  console.log(`[SMS] To: ${to} | Message: ${message}`);
  return { success: true, id: `sms_${Date.now()}` };
}

export function sendBookingConfirmation(email: string, phone: string, details: {
  pnr: string;
  train_name: string;
  train_number: string;
  from: string;
  to: string;
  date: string;
  total_fare: number;
}) {
  const subject = `Booking Confirmed - ${details.train_name} (${details.pnr})`;
  const message = `Your booking is confirmed!\n\nTrain: ${details.train_name} (${details.train_number})\nJourney: ${details.from} → ${details.to}\nDate: ${details.date}\nPNR: ${details.pnr}\nTotal Fare: ₹${details.total_fare}\n\nThank you for booking with RailBookPro.`;
  sendEmail(email, subject, message);
  sendSMS(phone, `Booking confirmed! PNR: ${details.pnr}, ${details.train_name}, ${details.from}→${details.to}, ${details.date}, Fare: ₹${details.total_fare}`);
}

export function sendCancellationConfirmation(email: string, phone: string, details: {
  pnr: string;
  train_name: string;
  refund: number;
}) {
  const subject = `Booking Cancelled - ${details.train_name} (${details.pnr})`;
  const message = `Your booking has been cancelled.\n\nTrain: ${details.train_name}\nPNR: ${details.pnr}\nRefund: ₹${details.refund}\n\nRefund will be processed to your original payment method.`;
  sendEmail(email, subject, message);
  sendSMS(phone, `Booking cancelled. PNR: ${details.pnr}, Refund: ₹${details.refund}. Refund will be processed shortly.`);
}

export function getNotificationLog() {
  return { email: emailLog, sms: smsLog };
}
