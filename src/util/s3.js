import AWS from "aws-sdk";
import multer from "multer";
import configVariables from "../server/config";
import { logger } from "./logger";


export async function upload_image(file, id) {
    AWS.config.update({
      accessKeyId: configVariables.AWS_ACCESS_KEY_ID,
      secretAccessKey: configVariables.AWS_SECRET_ACCESS_KEY,
      region: configVariables.AWS_REGION,
    });
  
    const s3 = new AWS.S3();
    // Configure multer for file uploads
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });
  
    try {
      const s3Params = {
        Bucket: configVariables.AWS_BUCKET_NAME,
        Key: `${Date.now()}_${id}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
  
      // Upload file to S3
      const data = await s3.upload(s3Params).promise();
      return data;
    } catch (error) {
      logger.error("Error uploading image:", error);
      return error;
    }
  }