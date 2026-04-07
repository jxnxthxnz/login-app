import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { registerSchema, loginSchema } from '@login-app/shared';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
