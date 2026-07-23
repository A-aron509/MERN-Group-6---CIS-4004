const nodemailer = require('nodemailer');

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

const sendPasswordResetEmail = async (toEmail, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `StayFresh <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset your StayFresh password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to set a new password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
