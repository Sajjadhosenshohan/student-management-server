import express from 'express';
import { register, login, getUserInfo } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getUserInfo/:userId', getUserInfo);

export default router;