import { ADMIN } from "../../constants/enum";
import adminHelper from "../../helpers/admin.helper";
import { generateToken } from "../../util/authUtil";
import bcrypt from "bcryptjs";
import { getAdminInfo, mailsend_contact_details } from "../../util/utilHelper";
import userHelper from '../../helpers/user.helper';
import orderHelper from '../../helpers/order.helper';
import productHelper from "../../helpers/product.helper";

export async function adminSignupHandler(input) {
  const existingAdmin = await adminHelper.getObjectByQuery({
    query: { email: input.email },
  });
  if (existingAdmin) {
    throw new Error("Admin with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const adminData = {
    email: input.email,
    password: hashedPassword,
    name: input.name,
    phone: input.phone,
    role: input.role,
  };

  const newAdmin = await adminHelper.addObject(adminData);

  const token = generateToken(newAdmin._id, newAdmin.role);

  return { admin: getAdminInfo(newAdmin), token };
}

export async function contactusHandler(input) {
  try { 
      const contact_us_details = {
          name: input.name,
          email: input.email,
          phone: input.phone,
          message: input.message,
          subject: input.subject
      };

      let template = "contactus";
      let mail_subject = "New Query from Skywall";
      const mailInput = {
          app_details: contact_us_details,
          templateName: template,
          subject_input: mail_subject
      };
      
      await mailsend_contact_details(mailInput);
      return { success: true, message: 'Contact Us Mail Sent successfully' };
      
  } catch (error) {
      console.error("Error in contactusHandler:", error);
      throw error;
  }
}

export async function getDashboardData(input) {
  const user_count = await userHelper.getAllObjectCount(input);
  const order_count = await orderHelper.getAllObjectCount(input);
  const product_count = await productHelper.getAllObjectCount(input);
  const products = await productHelper.getAllObjects(input);

  // Initialize total_stock to 0
  let total_stock = 0;

  // Calculate total stock
  products.forEach(product => {
    total_stock += product.stock;
  });

  return { user_count, order_count, product_count, total_stock };
}

export async function adminLoginHandler(input) {
  const admin = await adminHelper.getObjectByQuery({
    query: { email: input.email },
  });
  

  if (!admin) {
    throw new Error("Admin not found");
  }
  const isMatch = await bcrypt.compare(input.password, admin.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(admin._id, ADMIN);
  return { admin: getAdminInfo(admin), token };
}


export async function addNewAdminHandler(input) {
  return await adminHelper.addObject(input);
}

export async function getAdminDetailsHandler(input) {
  return await adminHelper.getObjectById(input);
}

export async function updateAdminDetailsHandler(input) {
  return await adminHelper.directUpdateObject(
    input.objectId,
    input.updateObject
  );
}

export async function getAdminListHandler(input) {
  const list = await adminHelper.getAllObjects(input);
  const count = await adminHelper.getAllObjectCount(input);
  return { list, count };
}

export async function deleteAdminHandler(input) {
  return await adminHelper.deleteObjectById(input);
}

export async function getAdminByQueryHandler(input) {
  return await adminHelper.getObjectByQuery(input);
}
