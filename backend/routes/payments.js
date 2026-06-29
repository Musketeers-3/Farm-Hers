import express from 'express';
import {
  createPaymentOrder,
  getPaymentOrder,
  updatePaymentOrder,
  getFarmerOrders,
  getBuyerOrders,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/orders', createPaymentOrder);
router.get('/orders', getPaymentOrder);
router.patch('/orders', updatePaymentOrder);
router.get('/farmer-orders/:farmerId', getFarmerOrders);
router.get('/buyer-orders/:buyerId', getBuyerOrders);

export default router;