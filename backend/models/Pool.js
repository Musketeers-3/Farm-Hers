import mongoose from 'mongoose';

const poolMemberSchema = new mongoose.Schema({
  farmerId: String,
  farmerName: String,
  quantity: Number,
  joinedAt: String,
}, { _id: false });

const poolSchema = new mongoose.Schema({
  creatorId: {
    type: String,
    required: true,
  },
  creatorRole: {
    type: String,
    enum: ['buyer', 'farmer'],
    required: true,
  },
  creatorName: String,
  commodity: String,
  pricePerUnit: Number,
  unit: String,
  targetQuantity: Number,
  requestedQuantity: Number,
  filledQuantity: {
    type: Number,
    default: 0,
  },
  members: [poolMemberSchema],
  status: {
    type: String,
    enum: ['open', 'filled', 'closed', 'cancelled', 'fulfilled', 'sold', 'pooled'],
    default: 'open',
  },
  deadline: String,
  location: String,
  description: String,
  lat: Number,
  lng: Number,
  matchedBuyerId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

poolSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Pool', poolSchema);