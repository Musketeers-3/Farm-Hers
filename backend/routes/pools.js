import express from 'express';
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
router.post('/', createPool);
router.put('/:id', updatePool);
router.post('/:poolId/join', joinPool);
router.post('/:id/close', closePool);

export default router;