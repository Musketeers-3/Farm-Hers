import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getPools,
  getPool,
  createPool,
  updatePool,
  joinPool,
  closePool,
} from '../controllers/poolController.js';

const router = express.Router();

router.get('/', getPools);
router.get('/:id', getPool);
router.post('/', authMiddleware, createPool);
router.put('/:id', authMiddleware, updatePool);
router.post('/:poolId/join', authMiddleware, joinPool);
router.post('/:id/close', authMiddleware, closePool);

export default router;