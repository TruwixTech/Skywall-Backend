import replaceall from "replaceall";
import _ from "lodash";
import nodemailer from "nodemailer";
import configVariables from "../../server/config";
import otpHelper from "../helpers/otp.helper";

export function sanitizeCountryCode(text) {
  if (text) {
    return replaceall("+", "", text); // text.replace('+', '')
  }
  return "";
}

export function getUserInfo(user) {
  return {
    _id: user._id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    address: user.address,
  };
}

export function getAdminInfo(user) {
  return {
    _id: user._id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    role: user.role,
  };
}

export function generateOtp(range) {
  var add = 1,
    max = 12 - add;
  if (range > max) {
    return generate(max) + generate(n - max);
  }
  max = Math.pow(10, range + add);
  var min = max / 10;
  var number = Math.floor(Math.random() * (max - min + 1)) + min;
  return ("" + number).substring(add);
}

export function generateOtpExpireDate() {
  var date = new Date();
  var otpExpiry = new Date(date);
  otpExpiry.setMinutes(date.getMinutes() + 40);
  return otpExpiry;
}

export function getDateMinutesDifference(date) {
  var countDownDate = new Date(date).getTime();
  const currentDate = new Date().getTime();
  var diff = Math.abs(currentDate - countDownDate);
  var minutes = Math.floor(diff / 1000 / 60);
  return minutes;
}

async function mailsend_details(app_details,templateName,email,subject_input) {
    
  console.log("Initializing mail sender...");

  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log("Transporter created successfully!");
  
  // Ensure Handlebars is correctly set up
  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.join(__dirname, "views/"),
        defaultLayout: false,
      },
      viewPath: path.join(__dirname, "views/"),
      extName: ".handlebars",
    })
  );

  console.log("Handlebars engine configured!");

  

  let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject_input,
      text: subject_input,
      template: templateName,
      context: {...app_details},
    };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${process.env.EMAIL_USER}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to Send Mail.");
  }
}


export async function verifyEmailOTP(email, otp) {
  try {
    const otpRecord = await otpHelper.getObjectByQuery({
      query: { email, otp },
    });

    if (!otpRecord) {
      throw "Invalid OTP";
    }

    if (new Date() > otpRecord.expiresAt) {
      await otpHelper.deleteObjectByQuery({ email, otp });
      throw "OTP has expired";
    }

    await otpHelper.deleteObjectByQuery({ email });

    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
}

export async function sendVerificationEmail(email, subject) {
  try {
    // Generate OTP
    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await otpHelper.updateOneAndUpdate({
      query: { email },
      updateQuery: {
        otp,
        expiresAt,
        created_at: new Date(),
        updated_at: new Date(),
      },
      options: { upsert: true, new: true },
    });

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: configVariables.EMAIL_USER,
        pass: configVariables.EMAIL_PASS,
      },
    });

    const message = `Your OTP is: ${otp}. It is valid for 10 minutes.`;

    const mailOptions = {
      from: configVariables.EMAIL_USER,
      to: email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendEmailNotification(email, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: configVariables.EMAIL_USER,
        pass: configVariables.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: configVariables.EMAIL_USER,
      to: email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
