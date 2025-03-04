import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dpospktfw",
  api_key: process.env.CLOUDINARY_API_KEY || "592653876575991",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "QkBNPb6Wz0YoWSIgirS8s_xexHE",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    // allowedFormats: ["jpg", "jpeg", "png"],
    format: async (req, file) => 'jpg', // supports promises as well
        public_id: (req, file) => file.originalname,
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

module.exports = { cloudinary, storage };
