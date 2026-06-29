import mongoose from 'mongoose';

const bidHistorySchema = new mongoose.Schema({
  buyerId: String,
  buyerName: String,
  amount: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isLeading: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

const auctionSchema = new mongoose.Schema({
  cropId: {
    type: String,
    required: true,
  },
  cropName: String,
  farmerId: {
    type: String,
    required: true,
  },
  farmerName: String,
  quantity: {
    type: Number,
    required: true,
  },
  startingPrice: {
    type: Number,
    required: true,
  },
  currentBid: {
    type: Number,
    default: 0,
  },
  highestBidderId: {
    type: String,
    default: null,
  },
  highestBidderName: String,
  endTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['live', 'ended', 'cancelled', 'sold'],
    default: 'live',
  },
  location: String,
  description: String,
  bidHistory: [bidHistorySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

auctionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Auction', auctionSchema);