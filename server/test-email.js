require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('HOST:', process.env.EMAIL_HOST);
  console.log('PORT:', process.env.EMAIL_PORT);
  console.log('USER:', process.env.EMAIL_USER);
  console.log('FROM:', process.env.EMAIL_FROM);
  console.log('ADMIN:', process.env.ADMIN_EMAIL);
  console.log('PASS:', process.env.EMAIL_PASS ? '***set***' : 'NOT SET');

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log('\n✓ SMTP connection verified — credentials are working!');

    // Test enquiry confirmation email
    const { sendEnquiryConfirmation, sendEnquiryAdminAlert, sendOrderConfirmation, sendOrderAdminAlert } = require('./services/emailService');

    const mockEnquiry = {
      name: 'Test Customer',
      email: process.env.EMAIL_USER,
      eventType: 'Wedding',
      eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      guestCount: 100,
      budget: '£2,500 - £5,000',
      venue: 'Test Venue, London',
      serviceStyle: 'Full-Service Catering',
      message: 'This is a test enquiry to verify email delivery.',
      createdAt: new Date(),
    };

    const mockOrder = {
      serviceType: 'main-menu',
      contact: { name: 'Test Customer', email: process.env.EMAIL_USER, phone: '+44 7700 000000' },
      estimatedTotal: 250,
      orderData: { fulfillment: 'delivery', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), address: '123 Test Street, London, E1 1AA' },
      createdAt: new Date(),
    };

    console.log('\nSending test enquiry confirmation...');
    await sendEnquiryConfirmation(mockEnquiry);
    console.log('✓ Enquiry confirmation sent to', process.env.EMAIL_USER);

    console.log('Sending test enquiry admin alert...');
    await sendEnquiryAdminAlert(mockEnquiry);
    console.log('✓ Enquiry admin alert sent to', process.env.ADMIN_EMAIL);

    console.log('Sending test order confirmation...');
    await sendOrderConfirmation(mockOrder);
    console.log('✓ Order confirmation sent to', process.env.EMAIL_USER);

    console.log('Sending test order admin alert...');
    await sendOrderAdminAlert(mockOrder);
    console.log('✓ Order admin alert sent to', process.env.ADMIN_EMAIL);

    console.log('\n✅ All emails sent successfully! Check both inboxes.');
  } catch (err) {
    console.error('\n✗ Email test failed:', err.message);
    if (err.message.includes('Invalid login') || err.message.includes('535')) {
      console.error('→ Check EMAIL_USER and EMAIL_PASS in .env');
    }
    if (err.message.includes('ECONNREFUSED') || err.message.includes('ETIMEDOUT')) {
      console.error('→ Check EMAIL_HOST and EMAIL_PORT in .env');
    }
  }
}

testEmail();
