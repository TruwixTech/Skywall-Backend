import dotenv from "dotenv";
dotenv.config();

const configVariables = {
  stage: process.env.STAGE || "dev",
  mongoURL:
    process.env.MONGO_URL ||
    "mongodb+srv://truwixtech:fnRqfSv2UM9WSNYE@skywall.4fzwh.mongodb.net/?retryWrites=true&w=majority&appName=skywall",
  PORT: Number(process.env.PORT) || 8080,
  JWT_SECRET: "5kYw@lL",

  EMAIL_USER: `truwixtech@gmail.com`,

  EMAIL_PASS: `bevputbfmnhmyowe`,
  GMAP_ID: 'AIzaSyBfn4LBnnogivHwdsxAcqDTN8mmS_SFw4o',
  EMAIL_USER_OTP: ``,
  EMAIL_PASS_OTP: ``,
  RAZORPAY_KEY_ID: '',
  RAZORPAY_KEY_SECRET: ''
};
export default configVariables;
