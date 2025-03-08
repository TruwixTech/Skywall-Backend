import replaceall from "replaceall";
import _ from "lodash";
import nodemailer from "nodemailer";
import configVariables from "../../server/config";
import otpHelper from "../helpers/otp.helper";
import hbs from 'nodemailer-handlebars';
import path from 'path';

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

export async function mailsend_details(app_details, templateName, email, subject_input) {
  console.log("Initializing mail sender...");
  
  
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: configVariables.EMAIL_USER,
      pass: configVariables.EMAIL_PASS,
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

  // Extract products from potential locations in the order object
  let products = [];
  if (Array.isArray(app_details.products)) {
    products = app_details.products;
  } else if (Array.isArray(app_details.items)) {
    products = app_details.items;
  } else if (app_details.products && typeof app_details.products === 'object') {
    // Handle case where products might be an object instead of array
    products = Object.values(app_details.products);
  }

  // Make sure each product has the required fields for the template
  const formattedProducts = products.map(product => {
    return {
      title: product.title || product.name || product.productName || "Product",
      category: product.category || "N/A",
      quantity: product.quantity || 1,
      warranty_expiry_date: product.warranty_expiry_date || "N/A",
      extended_warranty: product.extended_warranty || 0,
      total_warranty: product.total_warranty || product.warranty || 0
    };
  });


  // Format the context data as needed by the template
  const formattedContext = {
    orderNumber: app_details.orderNumber || app_details._id || app_details.id,
    status: app_details.status || "Processing",
    orderDate: app_details.orderDate || app_details.createdAt || new Date().toLocaleDateString(),
    expectedDelivery: app_details.expectedDelivery || "7-10 business days",
    totalPrice: app_details.totalPrice || app_details.total || app_details.amount || 0,
    shippingCost: app_details.shippingCost || 0,
    name: app_details.name || 
          (app_details.shipping && app_details.shipping.name) || 
          (app_details.customer && app_details.customer.name) || "Customer",
    address: app_details.address || 
            (app_details.shipping && app_details.shipping.address) || 
            (app_details.shipping && app_details.shipping.streetAddress) || "Address",
    city: app_details.city || 
          (app_details.shipping && app_details.shipping.city) || "City",
    pincode: app_details.pincode || 
            app_details.zipcode || 
            (app_details.shipping && app_details.shipping.pincode) || 
            (app_details.shipping && app_details.shipping.zipcode) || "Pincode",
    products: formattedProducts  // Use our specially formatted products array
  };


  let mailOptions = {
    from: configVariables.EMAIL_USER,
    to: email,
    subject: subject_input,
    text: subject_input, // Plain text fallback
    template: templateName,
    context: formattedContext,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to Send Mail: " + error.message);
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
