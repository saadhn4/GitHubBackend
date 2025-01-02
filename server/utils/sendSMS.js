import twilio from "twilio";
import config from "config";

let sid = config.get("SID");
let token = config.get("TOKEN");
let phone = config.get("PHONE");

async function sendSMS(smsData) {
  try {
    let client = new twilio(sid, token);
    await client.messages.create({
      from: phone,
      to: smsData.to,
      body: smsData.body,
    });
    console.log(`SMS sent.`);
  } catch (error) {
    console.log(error);
  }
}

// let obj = { to: "+919030358367", body: "Test bruv" };

// sendSMS(obj);

export default sendSMS;
