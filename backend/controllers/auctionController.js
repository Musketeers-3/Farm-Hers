import Auction from '../models/Auction.js';

export const getAuctions = async (req, res) => {
  try {
    const { status, cropId, farmerId } = req.query;
    let query = {};

    if (status) query.status = status;
    if (cropId) query.cropId = cropId;
    if (farmerId) query.farmerId = farmerId;

    const auctions = await Auction.find(query).sort({ createdAt: -1 });
    res.json({ auctions });
  } catch (error) {
    console.error('Get auctions error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    res.json({ auction });
  } catch (error) {
    console.error('Get auction error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createAuction = async (req, res) => {
  try {
    const {
      cropId,
      cropName,
      farmerId,
      farmerName,
      quantity,
      startingPrice,
      endTime,
      location,
      description,
    } = req.body;

    const now = new Date().toISOString();

    const auction = new Auction({
      cropId,
      cropName: cropName || cropId,
      farmerId,
      farmerName: farmerName || 'Unknown',
      quantity: Number(quantity),
      startingPrice: Number(startingPrice),
      currentBid: Number(startingPrice),
      highestBidderId: null,
      highestBidderName: null,
      endTime,
      status: 'live',
      location: location || null,
      description: description || null,
      bidHistory: [],
      createdAt: now,
      updatedAt: now,
    });

    await auction.save();
    res.status(201).json({ id: auction._id.toString(), ...auction.toObject() });
  } catch (error) {
    console.error('Create auction error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const placeBid = async (req, res) => {
  try {
    const { id } = req.params;
    const { buyerId, buyerName, bidAmount } = req.body;

    const auction = await Auction.findById(id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    if (auction.status !== 'live') {
      return res.status(400).json({ error: 'This auction has already closed.' });
    }

    const currentHighestBid = auction.currentBid || auction.startingPrice;

    if (bidAmount <= currentHighestBid) {
      return res.status(400).json({
        error: `Bid rejected. The current highest bid is already ₹${currentHighestBid}.`,
        currentBid: currentHighestBid,
      });
    }

    // Update previous leading bid to not leading
    auction.bidHistory.forEach(bid => {
      bid.isLeading = false;
    });

    // Add new bid to history
    auction.bidHistory.push({
      buyerId,
      buyerName: buyerName || 'Unknown',
      amount: bidAmount,
      timestamp: new Date(),
      isLeading: true,
    });

    // Update auction with new highest bid
    auction.currentBid = bidAmount;
    auction.highestBidderId = buyerId;
    auction.highestBidderName = buyerName || 'Unknown';
    auction.updatedAt = new Date();

    await auction.save();

    res.json({
      success: true,
      message: 'Bid accepted successfully.',
      newHighestBid: bidAmount,
      auction: {
        id: auction._id.toString(),
        currentBid: auction.currentBid,
        highestBidderId: auction.highestBidderId,
        highestBidderName: auction.highestBidderName,
      },
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const endAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const auction = await Auction.findByIdAndUpdate(
      id,
      {
        status: status || 'ended',
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    res.json({ auction });
  } catch (error) {
    console.error('End auction error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getFarmerAuctions = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const auctions = await Auction.find({ farmerId }).sort({ createdAt: -1 });
    res.json({ auctions });
  } catch (error) {
    console.error('Get farmer auctions error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getLiveAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ status: 'live' }).sort({ createdAt: -1 });
    res.json({ auctions });
  } catch (error) {
    console.error('Get live auctions error:', error);
    res.status(500).json({ error: error.message });
  }
};