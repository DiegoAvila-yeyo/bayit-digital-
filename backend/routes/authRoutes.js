import express from 'express';
import { 
    register, 
    loginUser, 
    socialLogin, 
    verifyEmail, 
    resendVerificationCode 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginUser);
router.post('/social-login', socialLogin); 
router.post('/verify-email', verifyEmail);
router.post('/resend-verification-code', resendVerificationCode);

export default router;