const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendEmail = async (to, subject, text) => {
  try {

    console.log("📧 Sending email to:", to);

    await transporter.sendMail({
      from: `"Taskify" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log("✅ Email sent successfully");

  } catch (error) {

    console.log("❌ Email failed:", error.message);

  }
};

module.exports = { sendEmail };
