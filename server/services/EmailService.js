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

// One function to rule them all
export const sendEmail = async ({ to, replyTo, subject, html, attachments }) => {
  try {
    await transporter.sendMail({
      // We keep UBIX as the official sender so Office365 doesn't block it
      from: `"UBIX Helpdesk" <${process.env.EMAIL_USER}>`, 
      to, 
      replyTo, // <--- This makes the User the "contact" person
      subject,
      html,
      attachments
    });
    console.log(`Email sent to: ${to} (Reply-To: ${replyTo})`);
  } catch (error) {
    console.error("Email error:", error);
  }
};