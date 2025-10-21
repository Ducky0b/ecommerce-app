const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.sendMail(
  {
    from: process.env.MAIL_USER,
    to: "vanviet28052002@gmail.com",
    subject: "Test email",
    text: "Email test từ IVYC Store",
  },
  (error, info) => {
    if (error) {
      console.log("❌ Error:", error);
      console.log("MAIL_USER:", process.env.MAIL_USER);
      console.log(
        "MAIL_PASS:",
        process.env.MAIL_PASS ? "✔️ Loaded" : "❌ Missing"
      );
    } else {
      console.log("✅ Sent:", info.response);
      console.log("MAIL_USER:", process.env.MAIL_USER);
      console.log(
        "MAIL_PASS:",
        process.env.MAIL_PASS ? "✔️ Loaded" : "❌ Missing"
      );
    }
  }
);
