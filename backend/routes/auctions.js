import express from 'express';
import {
  getAuctions,
  getAuction,
  createAuction,
  placeBid,
  endAuction,
  getFarmerAuctions,
  getLiveAuctions,
} from '../controllers/auctionController.js';

const router = express.Router();

// Get all auctions (with optional filters)
router.get('/', getAuctions);

// Get live auctions
router.get('/live', getLiveAuctions);

// Get auctions by farmer
router.get('/farmer/:farmerId', getFarmerAuctions);

// Get single auction
router.get('/:id', getAuction);

// Create new auction
router.post('/', createAuction);

// Place a bid
router.post('/:id/bid', placeBid);

// End/cancel auction
router.post('/:id/end', endAuction);

export default router;