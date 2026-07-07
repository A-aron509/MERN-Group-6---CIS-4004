const nodemailer = require('nodemailer');

// Uses Gmail here as an easy starting point (works with a Google App Password,
// not your normal password). Swap the transporter config later for SendGrid,
// Mailgun, etc. if you want something more "production" for the demo.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `StayFresh <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify your StayFresh account',
    html: `
      <h2>Welcome to StayFresh!</h2>
      <p>Click the link below to verify your email and activate your account:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
