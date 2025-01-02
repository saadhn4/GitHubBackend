import nodemailer from "nodemailer";
import config from "config";

const user = config.get("EMAIL");
const pass = config.get("PASS");

async function sendEmail(emailData) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });
    let sending = transporter.sendMail({
      from: `${user}`,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    });
    console.log(`Email sent`);
  } catch (error) {
    console.log(error);
  }
}

// let obj = {
//   to: "saadcfi4@gmail.com",
//   subject: "Phase 2 test",
//   html: `<p>Hello</p>
//   <a href="https://google.com">Redirect to google</a>`,
// };

// sendEmail(obj);

export default sendEmail
