import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

// /auth redirects to authRoutes to handle
router.use('/auth', authRoutes);

export default router;
