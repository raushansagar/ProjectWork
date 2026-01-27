import nodemailer from "nodemailer";


// send otp using nodemailer
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Login OTP",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });
};


export default sendOtpEmail;