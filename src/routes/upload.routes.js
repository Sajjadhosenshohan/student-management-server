import express from "express";
import multer from "multer";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { uploadPDFv3 } from "../controllers/upload.controller.js";

const router = express.Router();
// const upload = multer({ dest: "uploads/" });
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

router.use(authenticateToken);
router.post("/", upload.single("file"), uploadPDFv3);

export default router;
