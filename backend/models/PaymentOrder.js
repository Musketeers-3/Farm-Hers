import mongoose from 'mongoose';

const paymentOrderSchema = new mongoose.Schema({
  cropId: String,
  cropName: String,
  quantity: Number,
  pricePerQuintal: Number,
  totalAmount: Number,
  tokenAmount: Number,
  buyerId: String,
  buyerName: String,
  buyerPhone: String,
  farmerId: String,
  farmerName: String,
  poolId: String,
  status: {
    type: String,
    enum: ['pending', 'token-paid', 'awaiting-offline', 'payment-received', 'completed'],
    default: 'pending',
  },
  tokenPaymentId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  offlineMode: {
    type: String,
    enum: ['cheque', 'neft', 'upi'],
  },
  offlineReference: String,
  offlineSubmittedAt: Date,
  farmerConfirmedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

paymentOrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('PaymentOrder', paymentOrderSchema);