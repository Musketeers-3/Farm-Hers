import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createPaymentOrder,
  getPaymentOrder,
  updatePaymentOrder,
  getFarmerOrders,
  getBuyerOrders,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/orders', authMiddleware, createPaymentOrder);
router.get('/orders', authMiddleware, getPaymentOrder);
router.patch('/orders', authMiddleware, updatePaymentOrder);
router.get('/farmer-orders/:farmerId', authMiddleware, getFarmerOrders);
router.get('/buyer-orders/:buyerId', authMiddleware, getBuyerOrders);

export default router;