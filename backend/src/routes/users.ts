import { Router } from 'express';
import { authenticateToken, requireAdmin, requireTechnician, requireClient } from '../middleware/auth';
import {
  createTechnician,
  listTechnicians,
  updateTechnician,
  listClients,
  updateClient,
  deleteClient,
  getProfile,
  updateProfile,
} from '../controllers/userController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Admin only routes
router.post('/technicians', requireAdmin, createTechnician);
router.get('/technicians', requireAdmin, listTechnicians);
router.put('/technicians/:id', requireAdmin, updateTechnician);
router.get('/clients', requireAdmin, listClients);
router.put('/clients/:id', requireAdmin, updateClient);
router.delete('/clients/:id', requireAdmin, deleteClient);

// Profile routes (all authenticated users)
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
