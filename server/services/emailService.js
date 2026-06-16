const nodemailer = require('nodemailer');

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendInvoiceEmail({ clientName, clientEmail, invoiceNumber, pdfBase64, companyName, companyEmail }) {
  const from = companyEmail || process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${companyName}" <${from}>`,
    to: clientEmail,
    subject: `Invoice ${invoiceNumber} – ${companyName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#8B1A1A;padding:24px 32px">
          <h1 style="color:#fff;margin:0;font-size:22px">${companyName}</h1>
        </div>
        <div style="padding:32px">
          <p>Hello ${clientName},</p>
          <p>Please find your invoice <strong>${invoiceNumber}</strong> attached to this email.</p>
          <p>Review the details and proceed with payment as indicated on the invoice. If you have any questions, please don't hesitate to reach out.</p>
          <p>Thank you for choosing ${companyName}!</p>
          <br>
          <p style="color:#666">Warm regards,<br><strong>${companyName}</strong></p>
        </div>
        <div style="background:#f5f5f5;padding:16px 32px;font-size:12px;color:#999;text-align:center">
          This is an automated email from ${companyName}. Please do not reply directly.
        </div>
      </div>
    `,
    attachments: pdfBase64
      ? [{
          filename: `Invoice-${invoiceNumber}.pdf`,
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf',
        }]
      : [],
  });
}

module.exports = { sendInvoiceEmail };
