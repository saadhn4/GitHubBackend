import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import userModel from "../../models/User/User.js";
import sendEmail from "../../utils/sendEmail.js";
import sendSMS from "../../utils/sendSMS.js";

const router = express.Router();
const URL = config.get("URL");
const JWT_SECRET = config.get("JWT_SECRET");

router.post("/register", async (req, res) => {
  try {
    const {
      type,
      user_view_type,
      site_admin,
      name,
      email,
      phone,
      password,
      company,
      blog,
      location,
      hireable,
      bio,
      twitter_username,
      public_repos,
      public_gists,
      followers,
      following,
    } = req.body;

    //finding duplicates

    let existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists!" });
    }

    //hashing password

    let hashPass = await bcrypt.hash(password, 10);

    //generating tokens

    const emailToken = Math.random().toString(36).substring(2);

    const phoneToken = Math.random().toString(36).substring(2);

    console.log(emailToken, phoneToken);

    //passing new user as object

    let newUser = {
      type,
      user_view_type,
      site_admin,
      name,
      email,
      phone,
      password: hashPass,
      company,
      blog,
      location,
      hireable,
      bio,
      twitter_username,
      public_repos,
      public_gists,
      followers,
      following,
      userVerifyToken: {
        email: emailToken,
        phone: phoneToken,
      },
    };
    await userModel.create(newUser);

    //email verification

    // await sendEmail({
    //   to: email,
    //   subject: "Email verification link",
    //   html: `<p>Verify your email using the link below:</p>
    //   <a href= "${URL}/api/public/verifyemail/${emailToken}">Click on me</a>`,
    // });

    console.log(`${URL}/api/public/verifyemail/${emailToken}`);

    //sms verification

    // await sendSMS({
    //   to: phone,
    //   body: `Verify: ${URL}/api/public/verifyphone/${phoneToken}`,
    // });

    console.log(`${URL}/api/public/verifyphone/${phoneToken}`);

    //sending response
    res.status(200).json({
      msg: "User registered, please verify your phone and email.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/verifyemail/:token", async (req, res) => {
  try {
    //taking token from params

    const { token } = req.params;

    //user check

    let user = await userModel.findOne({ "userVerifyToken.email": token });

    if (!user) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    //true and null

    user.userVerify.email = true;
    user.userVerifyToken.email = null;
    await user.save();

    //response

    res.status(200).json({ msg: `Email verified` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/verifyphone/:token", async (req, res) => {
  try {
    //taking token from params

    const { token } = req.params;

    //user check

    let user = await userModel.findOne({ "userVerifyToken.phone": token });

    if (!user) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    //true and null

    user.userVerify.phone = true;
    user.userVerifyToken.phone = null;
    await user.save();

    //response

    res.status(200).json({ msg: `Phone verified` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    //req.body part
    const { email, password } = req.body;

    //check if valid email
    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    //check if email is verified

    if (!user.userVerify.email) {
      return res.status(400).json({ msg: "Email not verified." });
    }

    //check if phone is verified

    if (!user.userVerify.phone) {
      return res.status(400).json({ msg: "Phone not verified." });
    }

    //check if pass matches

    let match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    //generating token

    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ msg: "Logged in! Here's your token:", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

export default router;
