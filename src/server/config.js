import dotenv from "dotenv";
dotenv.config();

const configVariables = {
  stage: process.env.STAGE || "local",
  mongoURL:
    process.env.MONGO_URL ||
    "mongodb+srv://truwixtech:fnRqfSv2UM9WSNYE@skywall.4fzwh.mongodb.net/?retryWrites=true&w=majority&appName=skywall",
  PORT: Number(process.env.PORT) || 8080,
  JWT_SECRET: "jwt-secret",

EMAIL_USER:  `adityarajmgm@gmail.com`,

EMAIL_PASS:  `dbqafichejzypruw`,

MAIL_SEND:  `adityarajcv@outlook.com`,

EMAIL_USER_OTP : ``,
EMAIL_PASS_OTP : ``,


};
export default configVariables;
