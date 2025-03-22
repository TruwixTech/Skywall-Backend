import replaceall from "replaceall";
import _ from "lodash";
import nodemailer from "nodemailer";
import configVariables from "../../server/config";
import otpHelper from "../helpers/otp.helper";
import hbs from 'nodemailer-handlebars';
import path from 'path';
import PDFDocument from 'pdfkit';
import fs from 'fs';

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

export async function mailsend_details(input) {
  try {
    const { app_details, templateName, email, subject_input } = input
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: configVariables.EMAIL_USER,
        pass: configVariables.EMAIL_PASS,
      },
    });


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
        title: product.title || product.product_id.name || product.productName || "Product",
        category: product.product_id.category || "N/A",
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
      orderDate: app_details.orderDate || new Date().toLocaleDateString(),
      expectedDelivery: app_details.expectedDelivery || "7-10 business days",
      totalPrice: app_details.totalPrice,
      shippingCost: app_details.shippingCost || 0,
      name: app_details.name,
      address: app_details.address,
      city: app_details.city,
      pincode: app_details.pincode,
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

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function mailsend_contact_details(input) {
  try {

    const { app_details, templateName, subject_input } = input;

    if (!app_details) {
      throw "App details are missing in input."
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: configVariables.EMAIL_USER,
        pass: configVariables.EMAIL_PASS,
      },
    });

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

    const context_input = {
      name: app_details.name,
      email: app_details.email,
      phone: app_details.phone,
      subject: app_details.subject,
      message: app_details.message,
    };


    let mailOptions = {
      from: configVariables.EMAIL_USER,
      to: configVariables.EMAIL_USER,
      subject: subject_input,
      text: subject_input, // Plain text fallback
      template: templateName,
      context: context_input,
    };


    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}


export async function sendInvoiceEmail(userEmail, invoice) {
  const pdfPath = path.join(__dirname, `invoice_${invoice.invoiceNumber}.pdf`);
  const doc = new PDFDocument({ margin: 50 });
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  doc.fontSize(25).text("SkyWall", { align: "center" }).moveDown(0.5);
  doc.fontSize(12).text("Address: 49/26 Site: 4, Sahibabad Industrial Area Ghaziabad, Uttar Pradesh, India 201010.", { align: "center" });
  doc.text("Phone: +91 7079797902", { align: "center" });
  doc.text("Email: customer.care@foxskyindia.com", { align: "center" });
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown().fontSize(20).text(`Invoice`, { align: "center" });
  doc.moveDown(0.5).fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
  doc.text(`Invoice Date: ${new Date(invoice.created_at).toLocaleDateString()}`);
  doc.moveDown();
  doc.fontSize(14).text("Billed To:", { underline: true });
  doc.fontSize(12).text(`Customer ID: ${invoice.user_Id._id}`);
  doc.moveDown();

  doc.fontSize(14).text("Items:", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12);

  // Define column positions and widths
  const columns = [
    { title: "Item", x: 50, width: 150 },
    { title: "Quantity", x: 200, width: 50 },
    { title: "Warranty Expiry", x: 250, width: 100 },
    { title: "Extended (Months)", x: 350, width: 100 },
    { title: "Total Warranty (Months)", x: 450, width: 100 },
    { title: "Total", x: 500, width: 80, align: "right" }
  ];

  // Draw headers
  const headerY = doc.y;
  columns.forEach(col => {
    doc.text(col.title, col.x, headerY, {
      width: col.width,
      align: col.align || "left"
    });
  });
  doc.moveDown();

  // Draw item rows
  let totalAmount = invoice.amount || 0;
  for (const item of invoice.items || []) {
    if (!item.product) continue;

    const startY = doc.y;
    const itemData = {
      name: item.product.name || "Unknown Item",
      quantity: item.quantity ?? 1,
      warrantyExpiry: item.warranty_expiry_date || "N/A",
      extended: item.extendedWarrantyDuration || "N/A",
      totalWarranty: item.totalWarranty || "N/A",
      total: totalAmount
    };
    const warrantyExpiryDate = new Date(item.warranty_expiry_date);

    // Item Name (with text wrapping)
    const itemHeight = doc.heightOfString(itemData.name, { width: columns[0].width });
    doc.text(itemData.name, columns[0].x, startY, { width: columns[0].width });

    // Other columns (aligned to top)
    doc.text(itemData.quantity.toString(), columns[1].x, startY, {
      width: columns[1].width
    });
    doc.text(
      new Date(item.warranty_expiry_date).toLocaleDateString(),
      columns[2].x,
      startY,
      { width: columns[2].width }
    );
    doc.text(itemData.extended.toString(), columns[3].x, startY, {
      width: columns[3].width
    });
    doc.text(itemData.totalWarranty.toString(), columns[4].x, startY, {
      width: columns[4].width
    });
    doc.text(itemData.total.toFixed(2), columns[5].x, startY, {
      width: columns[5].width,
      align: "right"
    });

    // Move to next line based on tallest column
    doc.moveDown(itemHeight / doc.currentLineHeight());
  }
  doc.moveDown(4);
  doc.fontSize(14).text("Summary:", 50, doc.y, { underline: true }); // Align to left
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Total: ${invoice.currency} ${totalAmount.toFixed(2)}`, 50); // Align to left
  doc.moveDown(2);
  doc.fontSize(10).text("Thank you for your business!", { align: "center" });
  doc.moveTo(50, doc.y + 10).lineTo(550, doc.y + 10).stroke();
  doc.fontSize(10).text("Skywall © 2025", { align: "center" });
  doc.end();

  await new Promise((resolve) => writeStream.on('finish', resolve));

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: configVariables.EMAIL_USER,
      pass: configVariables.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: configVariables.EMAIL_USER,
    to: userEmail,
    subject: "Your Invoice from Skywall",
    text: "Please find your invoice attached.",
    attachments: [{ filename: `invoice_${invoice.invoiceNumber}.pdf`, path: pdfPath }],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending invoice email:", error);
  } finally {
    try {
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    } catch (deleteError) {
      console.error("Error deleting invoice file:", deleteError);
    }
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
