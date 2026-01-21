import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { uploadAvatar as uploadMiddleware } from '../middleware/upload';
import { uploadAvatar, deleteAvatar } from '../controllers/uploadController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Upload avatar
router.post('/avatar', uploadMiddleware, uploadAvatar);

// Delete avatar
router.delete('/avatar', deleteAvatar);

export default router;
