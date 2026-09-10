import express from 'express';
import { getMe, login, register, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me',authenticate, getMe);
router.put('/me', authenticate, updateProfile);

export default router;