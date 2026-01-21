import { Router } from 'express';
import { authenticateToken, requireAdmin, requireTechnician, requireClient } from '../middleware/auth';
import {
  createCall,
  listCalls,
  getCall,
  updateCall,
  deleteCall,
} from '../controllers/callController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Client routes
router.post('/', requireClient, createCall);

// All authenticated users can list calls (filtered by role)
router.get('/', listCalls);

// Get specific call
router.get('/:id', getCall);

// Update calls (technicians and admin)
router.put('/:id', requireTechnician, updateCall);

// Delete calls (admin and client who created it)
router.delete('/:id', deleteCall);

export default router;
