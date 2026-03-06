const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {

    console.log("📧 Sending email to:", to);

    await resend.emails.send({
      from: "Taskify <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      text: text
    });

    console.log("✅ Email sent successfully");

  } catch (error) {

    console.log("❌ Email failed:", error.message);

  }
};

module.exports = { sendEmail };
