import nodemailer from "nodemailer";
import { otpTemplate } from "../mail/template/emailVerificationTemplate.js";
import dotenv from "dotenv";

dotenv.config();

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "StudyNotion || Addu",
      to: `${email}`,
      subject: `${title}`,
      html:`${body}`,
    });

    console.log("✅ Email sent successfully:", info);
    return info;
  } catch (err) {
    console.log("❌ Error in sending mail:", err.message);
  }
};

export default mailSender;
