const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "74.125.24.108", // Gmail IPv4 SMTP
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📧 Sending email to:", to);

    const info = await transporter.sendMail({
      from: `"Taskify" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log("✅ Email sent:", info.response);

  } catch (error) {
    console.log("❌ Email failed:", error.message);
  }
};

module.exports = { sendEmail };
