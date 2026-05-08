const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to any email service provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Academic Advising System <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
