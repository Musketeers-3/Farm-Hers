import mongoose from 'mongoose';

const demandMemberSchema = new mongoose.Schema({
  farmerId: String,
  quantity: Number,
  joinedAt: String,
}, { _id: false });

const demandSchema = new mongoose.Schema({
  cropId: {
    type: String,
    required: true,
  },
  targetQuantity: {
    type: Number,
    required: true,
  },
  filledQuantity: {
    type: Number,
    default: 0,
  },
  pricePerQuintal: {
    type: Number,
    required: true,
  },
  bonusPerQuintal: {
    type: Number,
    default: 0,
  },
  deadline: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'filled', 'contracted', 'expired'],
    default: 'open',
  },
  buyerId: {
    type: String,
    required: true,
  },
  members: [demandMemberSchema],
  contributors: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Demand', demandSchema);