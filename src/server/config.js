import dotenv from "dotenv";
dotenv.config();

const configVariables = {
  stage: process.env.STAGE || "local",
  mongoURL:
    process.env.MONGO_URL ||
    "mongodb://localhost:27017",
  PORT: Number(process.env.PORT) || 8080,
  JWT_SECRET: "jwt-secret",

EMAIL_USER:  `adityarajmgm@gmail.com`,

EMAIL_PASS:  `dbqafichejzypruw`,

MAIL_SEND:  `adityarajcv@outlook.com`,

EMAIL_USER_OTP : ``,
EMAIL_PASS_OTP : ``,


};
export default configVariables;
