import express from 'express';
import {
  getDemands,
  getDemand,
  createDemand,
  joinDemand,
} from '../controllers/demandController.js';

const router = express.Router();

router.get('/', getDemands);
router.get('/:id', getDemand);
router.post('/', createDemand);
router.post('/:demandId/join', joinDemand);

export default router;