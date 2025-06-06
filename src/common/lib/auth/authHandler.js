import userHelper from "../../helpers/user.helper";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { generateToken } from "../../util/authUtil";
import { getUserInfo } from "../../util/utilHelper.js";
import { USER } from "../../constants/enum";
import _ from "lodash";
import {
  generateOtpExpireDate,
  generateOtp,
  mailsender,
} from "../../util/utilHelper.js";



export async function userSignupHandler(input) {


  // Hash the provided password.
  const hashedPassword = await bcrypt.hash(input.password, 10);

  // Prepare user data.
  const userData = {
    name: input.name,
    phone: input.phone,
    password: hashedPassword,
    email: input.email,
  };

  // Check if user with the same email or phone already exists.
  const existingUser = await userHelper.getObjectByQuery({
    query: { $or: [{ email: input.email }, { phone: input.phone }] },
  });
  if (existingUser) {
    throw "User with this email or phone already exists"
  }

  const newUser = await userHelper.addObject(userData);

  const token = generateToken(newUser._id, USER);

  return { user: getUserInfo(newUser), token };
}

export async function userLoginHandler(input) {
  let user;

  if (input.email) {
    user = await userHelper.getObjectByQuery({
      query: { email: input.email },
    });
  }

  if (!user) {
    throw "User not found"
  }

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) {
    throw "Invalid credentials"
  }

  const token = generateToken(user._id, "User");

  return { user: getUserInfo(user), token };
}

export async function updateUserDetailsHandler(input) {
  return await userHelper.directUpdateObject(
    input.objectId,
    input.updateObject
  );
}

export async function updateUserOtpHandler(userId, otp, expiry) {
  try {
    const updateData = {
      otp: otp,
      otp_expiry: expiry,
    };

    return await userHelper.directUpdateObject(userId, updateData);
  } catch (error) {
    console.error("Error in updateUserOtpHandler:", error);
    throw error;
  }
}

export async function changeUserPasswordHandler(input) {
  try {
    // Fetch the user by objectId and email
    const user = await userHelper.getObjectByQuery({
      query: { email: input.email },
      selectFrom: {}, // You can specify fields to select if needed
    });

    if (!user) {
      throw "User not found or email does not match";
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);
    // Update the user's password
    const updatedUser = await userHelper.directUpdateObject(user._id, {
      password: hashedPassword,
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
}

export async function verifyUserOtpHandler(email, otp) {
  try {
    const user = await userHelper.getObjectByQuery({
      query: { email },
      selectFrom: {
        name: 1,
        email: 1,
        otp: 1,
        otp_expiry: 1,
      },
    });

    if (!user) {
      throw "User not found";
    }

    if (!user.otp) {
      throw "OTP not found, request a new one";
    }

    if (new Date() > new Date(user.otp_expiry)) {
      throw "OTP expired, request a new one";
    }

    if (user.otp.toString() !== otp.toString()) {
      throw "Invalid OTP";
    }
    const newOTP = generateOtp(6);
    const newExpiry = generateOtpExpireDate();

    // Clear OTP after successful verification
    await userHelper.directUpdateObject(user._id, {
      otp: newOTP,
      otp_expiry: newExpiry,
    });

    return user;
  } catch (error) {
    console.error("Error in verifyUserOtpHandler:", error);
    throw error;
  }
}

export async function getUserByEmailPasswordHandler(input) {
  try {

    if (_.isEmpty(input.email) || _.isEmpty(input.password)) {
      throw "Email and password are required";
    }

    const filters = {
      query: { email: input.email },
      selectFrom: { name: 1, email: 1, password: 1 }, // Include password for comparison
    };

    const user = await userHelper.getObjectByQuery(filters);

    if (!user) {
      throw "User not found!";
    }

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(input.password, user.password);

    if (!passwordMatch) {
      throw "Incorrect password!";
    }

    delete user.password;
    return user;
  } catch (error) {
    console.error("Error in getUserByEmailPasswordHandler:", error);
    throw error;
  }
}

export async function getUserByEmailHandler(input) {
  try {
    if (_.isEmpty(input.email)) {
      throw "Email is required";
    }

    const filters = {
      query: { email: input.email },
      selectFrom: { name: 1, email: 1 },
    };

    const user = await userHelper.getObjectByQuery(filters);

    if (!user) {
      throw "User not found!";
    }

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function handleValidationChangePassword(body) {
  const { oldPassword, newPassword } = body;

  if (!oldPassword || !newPassword) {
    return {
      isValid: false,
      message: "Both old password and new password are required",
    };
  }

  return { isValid: true, message: "Validation successful" };
}

export async function mail(body) {
  try {
    const { email, password } = body;
    if (!email || !password) {
      throw "Email and password are required";
    }
    const gotUser = await getUserByEmailPasswordHandler({ email, password });
    if (!gotUser) {
      throw "Invalid email or password";
    }

    const otp = generateOtp(6);
    const expiry = generateOtpExpireDate();

    await updateUserOtpHandler(gotUser._id, otp, expiry);

    await mailsender(gotUser.name, gotUser.email, otp);

    return gotUser;
  } catch (err) {
    console.log(err);
    res.status(responseStatus.INTERNAL_SERVER_ERROR);
    res.send({
      status: responseData.ERROR,
      data: { message: err },
    });
  }
}
