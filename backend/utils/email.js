const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // ⭐ forces IPv4 instead of IPv6
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
