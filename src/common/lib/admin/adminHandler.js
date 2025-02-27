import { ADMIN } from "../../constants/enum";
import adminHelper from "../../helpers/admin.helper";
import { generateToken } from "../../util/authUtil";
import bcrypt from "bcryptjs";
import { getAdminInfo } from "../../util/utilHelper";

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

export async function adminLoginHandler(input) {
  const admin = await adminHelper.getObjectByQuery({
    query: { email: input.email },
  });
  
  console.log("Admin Password: "+admin.password+" Input Password: "+input.password);

  if (!admin) {
    throw new Error("Admin not found");
  }
  const isMatch = await bcrypt.compare(input.password, admin.password);
  console.log("IsMatch:"+isMatch);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(admin._id, ADMIN);
  return { admin: getAdminInfo(admin), token };
}

export async function updateReferralLevelHandler({ level, bonusAmount }) {
  return await referralLevelHelper.directUpdateObject(
    { level },
    { bonusAmount }
  );
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
