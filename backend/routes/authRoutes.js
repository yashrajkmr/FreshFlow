// FreshFlow Authentication Routes - Registration, Login, Session Profile
import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/signup', register); // Convenient alias for frontend / signup requests
router.post('/login', login);
router.get('/profile', getProfile);

export default router;
