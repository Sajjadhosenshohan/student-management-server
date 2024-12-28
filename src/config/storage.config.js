import multer from "multer"; // Import multer
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config.js";

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "RPI", // The folder name in Cloudinary where images will be stored
    format: async (req, file) => "pdf", // Supports promises as well
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // File name to be used
  },
});

// Initialize multer with Cloudinary storage
export const upload = multer({ storage });

// module.exports = { upload };
