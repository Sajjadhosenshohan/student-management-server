import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { uploadPDF } from '../controllers/upload.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(authenticateToken);
router.post('/', upload.single('file'), uploadPDF);

export default router;