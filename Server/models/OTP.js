import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

// a function -> to send emails
async function sendVerificationEmails(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyNotion",
      otp
    );
    console.log("Email sent Successfully", mailResponse);
  } catch (err) {
    console.log("error occured while sending mails: ", err);
    throw err;
  }
};

OTPSchema.pre("save", async function(next) {
  await sendVerificationEmails(this.email, this.otp);
  next();
})

export default mongoose.model("OTP", OTPSchema);
