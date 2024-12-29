import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config(); // Ensure this is called first

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("Cloudinary Config in Runtime:", cloudinary.config());

export default cloudinary;
