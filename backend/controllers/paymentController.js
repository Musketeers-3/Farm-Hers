import PaymentOrder from '../models/PaymentOrder.js';

export const createPaymentOrder = async (req, res) => {
  try {
    const orderData = req.body;

    const paymentOrder = new PaymentOrder({
      ...orderData,
      status: orderData.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await paymentOrder.save();
    res.status(201).json({
      success: true,
      orderId: paymentOrder._id.toString(),
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await PaymentOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({
      success: true,
      order: { id: order._id.toString(), ...order.toObject() },
    });
  } catch (error) {
    console.error('Get payment order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;

    const order = await PaymentOrder.findByIdAndUpdate(
      orderId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update payment order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getFarmerOrders = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const orders = await PaymentOrder.find({ farmerId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error('Get farmer orders error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getBuyerOrders = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const orders = await PaymentOrder.find({ buyerId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error('Get buyer orders error:', error);
    res.status(500).json({ error: error.message });
  }
};