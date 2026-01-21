import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  createService,
  listServices,
  getService,
  updateService,
  deactivateService,
} from '../controllers/serviceController';

const router = Router();

// Public routes (for listing services)
router.get('/', listServices);
router.get('/:id', getService);

// Protected routes (require admin)
router.use(authenticateToken);
router.use(requireAdmin);

router.post('/', createService);
router.put('/:id', updateService);
router.patch('/:id/deactivate', deactivateService);

export default router;
