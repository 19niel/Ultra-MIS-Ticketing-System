import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({
  to,
  cc,
  bcc,
  replyTo,
  subject,
  html,
  attachments,
}) => {
  try {
    await transporter.sendMail({
      from: `"UBIX Helpdesk" <${process.env.EMAIL_USER}>`,
      to,
      cc,   // ✅ ADD THIS
      bcc,  // ✅ OPTIONAL BUT RECOMMENDED
      replyTo,
      subject,
      html,
      attachments,
    });

    console.log(`Email sent to: ${to}`);
  } catch (error) {
    console.error("Email error:", error);
  }
};
