import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getDemands,
  getDemand,
  createDemand,
  joinDemand,
} from '../controllers/demandController.js';

const router = express.Router();

router.get('/', getDemands);
router.get('/:id', getDemand);
router.post('/', authMiddleware, createDemand);
router.post('/:demandId/join', authMiddleware, joinDemand);

export default router;