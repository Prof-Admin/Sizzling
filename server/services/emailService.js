const nodemailer = require('nodemailer');

const BRAND_RED = '#8B1A1A';
const COMPANY_NAME = 'Sizzling Sensations';
const COMPANY_EMAIL = process.env.ADMIN_EMAIL || 'hello@sizzlingsensations.co.uk';
const COMPANY_WEBSITE = 'www.sizzlingsensations.co.uk';

const SERVICE_LABELS = {
  'main-menu': 'Bowl Food',
  'food-boxes': 'Individual Food Boxes',
  'grazing': 'Grazing Table',
  'grazing-table': 'Grazing Table',
  'platter': 'Platter',
  'full-service': 'Full-Service Catering',
};

const RESPONSE_TIMES = {
  'main-menu': 'within 2 hours',
  'food-boxes': 'within 2 hours',
  'grazing': 'within 24 hours',
  'grazing-table': 'within 24 hours',
  'platter': 'within 2 hours',
  'full-service': 'within 24 hours',
};

// Hostinger SMTP only allows sending from the authenticated account address
const FROM_ADDRESS = process.env.EMAIL_USER;

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

function fmt(amount) {
  return `£${Number(amount).toFixed(2)}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// ─── Shared base template ────────────────────────────────────────────────────

function baseTemplate(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${BRAND_RED};padding:28px 36px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:0.5px;">${COMPANY_NAME}</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:12px;letter-spacing:1px;text-transform:uppercase;">London's Premier African Catering</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px;">
              ${bodyHtml}
              <p style="margin:28px 0 0;color:#555555;font-size:14px;line-height:1.6;">
                Warm regards,<br/>
                <strong style="color:#1a1a1a;">${COMPANY_NAME}</strong>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 36px;">
              <hr style="border:none;border-top:1px solid #eeeeee;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:20px 36px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#888888;">
                <a href="mailto:${COMPANY_EMAIL}" style="color:${BRAND_RED};text-decoration:none;">${COMPANY_EMAIL}</a>
                &nbsp;·&nbsp;
                <span>${COMPANY_WEBSITE}</span>
              </p>
              <p style="margin:4px 0 0;font-size:11px;color:#bbbbbb;">
                &copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.<br/>
                This is an automated email — please do not reply directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Reusable parts ──────────────────────────────────────────────────────────

function summaryTable(rows) {
  const cells = rows
    .filter(([, val]) => val !== undefined && val !== null && val !== '' && val !== '—')
    .map(([label, val]) => `
      <tr>
        <td style="padding:10px 14px;font-size:13px;color:#666666;font-weight:600;white-space:nowrap;border-bottom:1px solid #f0f0f0;width:40%;">${label}</td>
        <td style="padding:10px 14px;font-size:13px;color:#1a1a1a;border-bottom:1px solid #f0f0f0;">${val}</td>
      </tr>`)
    .join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:4px;margin:20px 0;overflow:hidden;">
      <tbody>${cells}</tbody>
    </table>`;
}

function nextStepsBox(text) {
  return `
    <div style="background:#fff8f0;border-left:4px solid ${BRAND_RED};padding:16px 20px;margin:24px 0;border-radius:0 4px 4px 0;">
      <p style="margin:0;font-size:13px;color:#555555;line-height:1.6;">${text}</p>
    </div>`;
}

function highlightBadge(text) {
  return `<span style="display:inline-block;background:${BRAND_RED};color:#ffffff;font-size:12px;font-weight:bold;padding:4px 12px;border-radius:2px;margin-bottom:16px;">${text}</span>`;
}

// ─── 1. Enquiry confirmation → customer ─────────────────────────────────────

async function sendEnquiryConfirmation(enquiry) {
  const from = FROM_ADDRESS;
  const transporter = createTransporter();

  const body = `
    <p style="margin:0 0 8px;font-size:15px;color:#1a1a1a;">Hello <strong>${enquiry.name}</strong>,</p>
    <p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.6;">
      Thank you for reaching out to ${COMPANY_NAME}! We've received your enquiry and will be in touch
      <strong>within 4 business hours</strong> with a tailored response.
    </p>

    <h2 style="margin:0 0 4px;font-size:15px;color:#1a1a1a;font-weight:bold;">Your Enquiry Summary</h2>
    ${summaryTable([
      ['Event Type', enquiry.eventType],
      ['Event Date', formatDate(enquiry.eventDate)],
      ['Guest Count', enquiry.guestCount],
      ['Service Style', enquiry.serviceStyle || '—'],
      ['Budget', enquiry.budget || '—'],
      ['Venue / Location', enquiry.venue || '—'],
    ])}

    ${enquiry.message ? `
    <h2 style="margin:20px 0 4px;font-size:15px;color:#1a1a1a;font-weight:bold;">Your Message</h2>
    <p style="margin:0;font-size:13px;color:#555555;line-height:1.6;padding:14px;background:#f9f9f9;border-radius:4px;">${enquiry.message}</p>
    ` : ''}

    ${nextStepsBox(`
      <strong>What happens next?</strong><br/>
      One of our team will review your enquiry and get back to you at
      <a href="mailto:${enquiry.email}" style="color:${BRAND_RED};">${enquiry.email}</a> within 4 business hours.
      If you have any urgent questions in the meantime, please email us at
      <a href="mailto:${COMPANY_EMAIL}" style="color:${BRAND_RED};">${COMPANY_EMAIL}</a>.
    `)}
  `;

  await transporter.sendMail({
    from: `"${COMPANY_NAME}" <${from}>`,
    to: enquiry.email,
    subject: `We've received your enquiry — ${COMPANY_NAME}`,
    html: baseTemplate(body),
  });
}

// ─── 2. Enquiry alert → admin ────────────────────────────────────────────────

async function sendEnquiryAdminAlert(enquiry) {
  const from = FROM_ADDRESS;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const transporter = createTransporter();

  const body = `
    ${highlightBadge('NEW ENQUIRY')}
    <p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.6;">
      A new enquiry has been submitted via the website.
    </p>

    <h2 style="margin:0 0 4px;font-size:15px;color:#1a1a1a;font-weight:bold;">Contact Details</h2>
    ${summaryTable([
      ['Name', enquiry.name],
      ['Email', `<a href="mailto:${enquiry.email}" style="color:${BRAND_RED};">${enquiry.email}</a>`],
    ])}

    <h2 style="margin:20px 0 4px;font-size:15px;color:#1a1a1a;font-weight:bold;">Enquiry Details</h2>
    ${summaryTable([
      ['Event Type', enquiry.eventType],
      ['Event Date', formatDate(enquiry.eventDate)],
      ['Guest Count', enquiry.guestCount],
      ['Service Style', enquiry.serviceStyle || '—'],
      ['Budget', enquiry.budget || '—'],
      ['Venue / Location', enquiry.venue || '—'],
      ['Submitted', new Date(enquiry.createdAt).toLocaleString('en-GB')],
    ])}

    ${enquiry.message ? `
    <h2 style="margin:20px 0 4px;font-size:15px;color:#1a1a1a;font-weight:bold;">Message</h2>
    <p style="margin:0;font-size:13px;color:#555555;line-height:1.6;padding:14px;background:#f9f9f9;border-radius:4px;">${enquiry.message}</p>
    ` : ''}

    ${nextStepsBox('Log in to the admin panel to view and respond to this enquiry. Remember to update the status once contacted.')}
  `;

  await transporter.sendMail({
    from: `"${COMPANY_NAME}" <${from}>`,
    to: adminEmail,
    subject: `New Enquiry: ${enquiry.name} — ${enquiry.eventType}`,
    html: baseTemplate(body),
  });
}

// ─── 3. Order confirmation → customer ───────────────────────────────────────

async function sendOrderConfirmation(order) {
  const from = FROM_ADDRESS;
  const transporter = createTransporter();

  const serviceLabel = SERVICE_LABELS[order.serviceType] || order.serviceType;
  const responseTime = RESPONSE_TIMES[order.serviceType] || 'shortly';

  const subjectMap = {
    'main-menu': `Your Bowl Food order has been received`,
    'food-boxes': `Your Food Box order has been received`,
    'grazing': `Your Grazing Table request has been received`,
    'grazing-table': `Your Grazing Table request has been received`,
    'platter': `Your Platter order has been received`,
    'full-service': `Your Full-Service Catering request has been received`,
  };
  const subject = subjectMap[order.serviceType] || `Your order has been received`;

  const body = `
    <p style="margin:0 0 8px;font-size:15px;color:#1a1a1a;">Hello <strong>${order.contact.name}</strong>,</p>
    <p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.6;">
      Thank you for choosing ${COMPANY_NAME}! We've received your <strong>${serviceLabel}</strong> request
      and will be in touch <strong>${responseTime}</strong> to confirm the details.
    </p>

    <h2 style="margin:0 0 4px;font-size:15px;color:#1a1a1a;font-weight:bold;">Order Summary</h2>
    ${summaryTable([
      ['Service', serviceLabel],
      ['Estimated Total', fmt(order.estimatedTotal)],
      ['Name', order.contact.name],
      ['Email', order.contact.email],
      ['Phone', order.contact.phone],
    ])}

    ${nextStepsBox(`
      <strong>What happens next?</strong><br/>
      Our team will review your order and reach out at
      <a href="mailto:${order.contact.email}" style="color:${BRAND_RED};">${order.contact.email}</a>
      ${responseTime} to confirm availability and next steps.
      If you have any questions, email us at
      <a href="mailto:${COMPANY_EMAIL}" style="color:${BRAND_RED};">${COMPANY_EMAIL}</a>.
    `)}
  `;

  await transporter.sendMail({
    from: `"${COMPANY_NAME}" <${from}>`,
    to: order.contact.email,
    subject: `${subject} — ${COMPANY_NAME}`,
    html: baseTemplate(body),
  });
}

// ─── 4. Order alert → admin ──────────────────────────────────────────────────

async function sendOrderAdminAlert(order) {
  const from = FROM_ADDRESS;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const transporter = createTransporter();
  const serviceLabel = SERVICE_LABELS[order.serviceType] || order.serviceType;

  // Format orderData fields for display
  const od = order.orderData || {};
  const extraRows = [];
  if (od.fulfillment)      extraRows.push(['Fulfillment', od.fulfillment]);
  if (od.date)             extraRows.push(['Requested Date', formatDate(od.date)]);
  if (od.address)          extraRows.push(['Delivery Address', od.address]);
  if (od.notes)            extraRows.push(['Notes', od.notes]);
  if (od.event?.eventType) extraRows.push(['Event Type', od.event.eventType]);
  if (od.event?.venue)     extraRows.push(['Venue', od.event.venue]);
  if (od.dietary?.details) extraRows.push(['Dietary', od.dietary.details]);

  const body = `
    ${highlightBadge('NEW ORDER')}
    <p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.6;">
      A new <strong>${serviceLabel}</strong> order has been submitted.
    </p>

    <h2 style="margin:0 0 4px;font-size:15px;color:#1a1a1a;font-weight:bold;">Customer Details</h2>
    ${summaryTable([
      ['Name', order.contact.name],
      ['Email', `<a href="mailto:${order.contact.email}" style="color:${BRAND_RED};">${order.contact.email}</a>`],
      ['Phone', order.contact.phone],
    ])}

    <h2 style="margin:20px 0 4px;font-size:15px;color:#1a1a1a;font-weight:bold;">Order Details</h2>
    ${summaryTable([
      ['Service', serviceLabel],
      ['Estimated Total', fmt(order.estimatedTotal)],
      ['Submitted', new Date(order.createdAt).toLocaleString('en-GB')],
      ...extraRows,
    ])}

    ${nextStepsBox('Log in to the admin panel to view the full order details and update its status.')}
  `;

  await transporter.sendMail({
    from: `"${COMPANY_NAME}" <${from}>`,
    to: adminEmail,
    subject: `New Order: ${serviceLabel} — ${order.contact.name} (${fmt(order.estimatedTotal)})`,
    html: baseTemplate(body),
  });
}

// ─── 5. Invoice email → client (enhanced) ───────────────────────────────────

async function sendInvoiceEmail({ clientName, clientEmail, invoiceNumber, pdfBase64, companyName, companyEmail, invoice, bankDetails, stripeLink }) {
  const from = FROM_ADDRESS;
  const transporter = createTransporter();
  const displayName = companyName || COMPANY_NAME;

  let paymentSection = '';
  if (invoice?.paymentMethod === 'bank_transfer' && bankDetails) {
    paymentSection = `
      <h2 style="margin:24px 0 4px;font-size:15px;color:#1a1a1a;font-weight:bold;">Payment Details</h2>
      <p style="margin:0 0 8px;font-size:13px;color:#555555;">Please use the following details to make your bank transfer:</p>
      ${summaryTable([
        ['Bank Name',       bankDetails.bankName || '—'],
        ['Account Name',    bankDetails.accountName || '—'],
        ['Account Number',  bankDetails.accountNumber || '—'],
        ['Sort Code',       bankDetails.sortCode || '—'],
        ['Reference',       bankDetails.paymentReference ? bankDetails.paymentReference.replace('[number]', invoiceNumber) : invoiceNumber],
      ])}`;
  } else if (invoice?.paymentMethod === 'stripe' && stripeLink) {
    paymentSection = `
      <h2 style="margin:24px 0 4px;font-size:15px;color:#1a1a1a;font-weight:bold;">Pay Online</h2>
      <p style="margin:0 0 16px;font-size:13px;color:#555555;">Click the button below to pay securely online:</p>
      <a href="${stripeLink}" style="display:inline-block;background:${BRAND_RED};color:#ffffff;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:3px;text-decoration:none;">Pay Now</a>`;
  }

  const body = `
    <p style="margin:0 0 8px;font-size:15px;color:#1a1a1a;">Hello <strong>${clientName}</strong>,</p>
    <p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.6;">
      Please find your invoice <strong>${invoiceNumber}</strong> attached to this email.
      Review the details and proceed with payment as outlined below.
    </p>

    ${summaryTable([
      ['Invoice Number', invoiceNumber],
      ['Due Date', invoice?.dueDate ? formatDate(invoice.dueDate) : '—'],
      ['Amount Due', invoice?.grandTotal ? fmt(invoice.grandTotal) : '—'],
    ])}

    ${paymentSection}

    ${nextStepsBox(`
      If you have any questions about this invoice, please don't hesitate to get in touch at
      <a href="mailto:${companyEmail || COMPANY_EMAIL}" style="color:${BRAND_RED};">${companyEmail || COMPANY_EMAIL}</a>.
      Thank you for choosing ${displayName}!
    `)}
  `;

  await transporter.sendMail({
    from: `"${displayName}" <${from}>`,
    to: clientEmail,
    subject: `Invoice ${invoiceNumber} — ${displayName}`,
    html: baseTemplate(body),
    attachments: pdfBase64
      ? [{
          filename: `Invoice-${invoiceNumber}.pdf`,
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf',
        }]
      : [],
  });
}

// ─── 6. Enquiry status change → customer ────────────────────────────────────

const ENQUIRY_STATUS_COPY = {
  contacted: {
    subject: "We've been in touch — Sizzling Sensations",
    heading: "We've Reached Out",
    body: "We've reviewed your enquiry and one of our team has been in touch. Please check your inbox (and spam folder) for our response.",
  },
  quoted: {
    subject: 'Your quote is ready — Sizzling Sensations',
    heading: 'Your Quote Is Ready',
    body: "We've prepared a tailored quote for your event. Please check your inbox for our proposal — we'd love to bring your event to life!",
  },
  confirmed: {
    subject: 'Your booking is confirmed — Sizzling Sensations',
    heading: 'Booking Confirmed!',
    body: "Fantastic news — your booking with Sizzling Sensations is confirmed. We're looking forward to making your event special. Our team will be in touch with the next steps.",
  },
  declined: {
    subject: 'Regarding your enquiry — Sizzling Sensations',
    heading: 'Thank You for Your Enquiry',
    body: "Thank you for reaching out to us. Unfortunately, we're unable to accommodate your request at this time. We hope to work with you in the future and wish you all the best for your event.",
  },
};

async function sendEnquiryStatusEmail(enquiry) {
  const copy = ENQUIRY_STATUS_COPY[enquiry.status];
  if (!copy) return; // 'new' status doesn't need an email

  const from = FROM_ADDRESS;
  const transporter = createTransporter();

  const body = `
    <p style="margin:0 0 8px;font-size:15px;color:#1a1a1a;">Hello <strong>${enquiry.name}</strong>,</p>
    <h2 style="margin:0 0 12px;font-size:18px;color:#1a1a1a;font-weight:bold;">${copy.heading}</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.6;">${copy.body}</p>

    ${summaryTable([
      ['Event Type', enquiry.eventType],
      ['Event Date', formatDate(enquiry.eventDate)],
      ['Guest Count', enquiry.guestCount],
    ])}

    ${nextStepsBox(`
      Questions? Email us at
      <a href="mailto:${COMPANY_EMAIL}" style="color:${BRAND_RED};">${COMPANY_EMAIL}</a> and we'll get back to you promptly.
    `)}
  `;

  await transporter.sendMail({
    from: `"${COMPANY_NAME}" <${from}>`,
    to: enquiry.email,
    subject: copy.subject,
    html: baseTemplate(body),
  });
}

// ─── 7. Order status change → customer ──────────────────────────────────────

const ORDER_STATUS_COPY = {
  confirmed: {
    subject: 'Your order is confirmed — Sizzling Sensations',
    heading: 'Order Confirmed!',
    body: "Great news — your order has been confirmed. We're getting everything ready and will keep you updated as we progress.",
  },
  'in-progress': {
    subject: 'Your order is being prepared — Sizzling Sensations',
    heading: 'Your Order Is Being Prepared',
    body: "Your order is now in progress — our team is preparing everything fresh for your event. We'll be in touch shortly with delivery or collection details.",
  },
  completed: {
    subject: 'Thank you for your order — Sizzling Sensations',
    heading: 'Order Complete — Thank You!',
    body: "Your order is complete. We hope everything was to your satisfaction! If you have any feedback, we'd love to hear from you.",
  },
  cancelled: {
    subject: 'Your order has been cancelled — Sizzling Sensations',
    heading: 'Order Cancelled',
    body: "Your order has been cancelled. If you have any questions or believe this was done in error, please contact us and we'll be happy to help.",
  },
};

async function sendOrderStatusEmail(order) {
  const copy = ORDER_STATUS_COPY[order.status];
  if (!copy) return; // 'new' status handled separately on submission

  const from = FROM_ADDRESS;
  const transporter = createTransporter();
  const serviceLabel = SERVICE_LABELS[order.serviceType] || order.serviceType;

  const body = `
    <p style="margin:0 0 8px;font-size:15px;color:#1a1a1a;">Hello <strong>${order.contact.name}</strong>,</p>
    <h2 style="margin:0 0 12px;font-size:18px;color:#1a1a1a;font-weight:bold;">${copy.heading}</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.6;">${copy.body}</p>

    ${summaryTable([
      ['Service', serviceLabel],
      ['Estimated Total', fmt(order.estimatedTotal)],
    ])}

    ${nextStepsBox(`
      Questions? Email us at
      <a href="mailto:${COMPANY_EMAIL}" style="color:${BRAND_RED};">${COMPANY_EMAIL}</a> — we're always happy to help.
    `)}
  `;

  await transporter.sendMail({
    from: `"${COMPANY_NAME}" <${from}>`,
    to: order.contact.email,
    subject: copy.subject,
    html: baseTemplate(body),
  });
}

// ─── 8. Payment reminder → client ───────────────────────────────────────────

async function sendPaymentReminder({ clientName, clientEmail, invoiceNumber, invoice, bankDetails, stripeLink, companyName, companyEmail }) {
  const from = FROM_ADDRESS;
  const transporter = createTransporter();
  const displayName = companyName || COMPANY_NAME;

  let paymentSection = '';
  if (invoice?.paymentMethod === 'bank_transfer' && bankDetails) {
    paymentSection = `
      <h2 style="margin:24px 0 4px;font-size:15px;color:#1a1a1a;font-weight:bold;">Payment Details</h2>
      ${summaryTable([
        ['Bank Name',       bankDetails.bankName || '—'],
        ['Account Name',    bankDetails.accountName || '—'],
        ['Account Number',  bankDetails.accountNumber || '—'],
        ['Sort Code',       bankDetails.sortCode || '—'],
        ['Reference',       bankDetails.paymentReference ? bankDetails.paymentReference.replace('[number]', invoiceNumber) : invoiceNumber],
      ])}`;
  } else if (stripeLink) {
    paymentSection = `
      <h2 style="margin:24px 0 4px;font-size:15px;color:#1a1a1a;font-weight:bold;">Pay Online</h2>
      <p style="margin:0 0 16px;font-size:13px;color:#555555;">Click the button below to settle your invoice securely online:</p>
      <a href="${stripeLink}" style="display:inline-block;background:${BRAND_RED};color:#ffffff;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:3px;text-decoration:none;">Pay Now</a>`;
  }

  const body = `
    <p style="margin:0 0 8px;font-size:15px;color:#1a1a1a;">Hello <strong>${clientName}</strong>,</p>
    <p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.6;">
      This is a friendly reminder that invoice <strong>${invoiceNumber}</strong> is awaiting payment.
      Please find the details below.
    </p>

    ${summaryTable([
      ['Invoice Number', invoiceNumber],
      ['Amount Due',     invoice?.grandTotal ? fmt(invoice.grandTotal) : '—'],
      ['Due Date',       invoice?.dueDate ? formatDate(invoice.dueDate) : '—'],
      ['Status',         invoice?.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : '—'],
    ])}

    ${paymentSection}

    ${nextStepsBox(`
      If you have already made payment, please disregard this reminder. For any queries, contact us at
      <a href="mailto:${companyEmail || COMPANY_EMAIL}" style="color:${BRAND_RED};">${companyEmail || COMPANY_EMAIL}</a>.
    `)}
  `;

  await transporter.sendMail({
    from: `"${displayName}" <${from}>`,
    to: clientEmail,
    subject: `Payment Reminder: Invoice ${invoiceNumber} — ${displayName}`,
    html: baseTemplate(body),
  });
}

// ─── 9. Newsletter welcome → subscriber ──────────────────────────────────────

async function sendWelcomeSubscriberEmail(email, unsubscribeUrl) {
  const from = FROM_ADDRESS;
  const transporter = createTransporter();

  const body = `
    <h2 style="margin:0 0 12px;font-size:18px;color:#1a1a1a;font-weight:bold;">Welcome to Our Newsletter!</h2>
    <p style="margin:0 0 16px;font-size:14px;color:#555555;line-height:1.6;">
      Thank you for subscribing to the Sizzling Sensations newsletter. You'll be the first to hear about new menu items, seasonal specials, and event catering tips.
    </p>
    <p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.6;">
      We're so glad you're here. Stay tuned for some delicious updates!
    </p>
    ${nextStepsBox(`
      Don't want to receive these emails?
      <a href="${unsubscribeUrl}" style="color:${BRAND_RED};">Unsubscribe here</a>.
    `)}
  `;

  await transporter.sendMail({
    from: `"${COMPANY_NAME}" <${from}>`,
    to: email,
    subject: `Welcome to Sizzling Sensations — You're on the list!`,
    html: baseTemplate(body),
  });
}

// ─── 10. Newsletter broadcast → subscriber ───────────────────────────────────

async function sendNewsletterEmail({ to, subject, contentHtml, unsubscribeUrl }) {
  const from = FROM_ADDRESS;
  const transporter = createTransporter();

  const body = `
    ${contentHtml}
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #eeeeee;">
      <p style="font-size:11px;color:#aaaaaa;margin:0;">
        You're receiving this because you subscribed to the ${COMPANY_NAME} newsletter.<br/>
        <a href="${unsubscribeUrl}" style="color:${BRAND_RED};font-size:11px;">Unsubscribe</a>
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"${COMPANY_NAME}" <${from}>`,
    to,
    subject,
    html: baseTemplate(body),
  });
}

module.exports = {
  sendEnquiryConfirmation,
  sendEnquiryAdminAlert,
  sendOrderConfirmation,
  sendOrderAdminAlert,
  sendInvoiceEmail,
  sendEnquiryStatusEmail,
  sendOrderStatusEmail,
  sendPaymentReminder,
  sendWelcomeSubscriberEmail,
  sendNewsletterEmail,
};
