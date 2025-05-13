import nodemailer from "nodemailer";
export const sendEmail = async (Option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: Option.email,
    subject: Option.subject,
    text: Option.message,
  };
  await transporter.sendMail(mailOptions);
};
