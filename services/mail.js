const nodemailer = require('nodemailer');

module.exports = async (mail, mailData) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    },
  });

  const mailOptions = {
    from: mailData.from,
    to: mail,
    subject: mailData.subject,
    text: mailData.text
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    return response
  } catch (err) {
    throw err;
  }
}