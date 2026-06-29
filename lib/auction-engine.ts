// lib/auction-engine.ts
import { auctionsAPI } from './api';

export interface BidResult {
  success: boolean;
  message: string;
  newHighestBid?: number;
}

/**
 * Safely processes a live bid, preventing race conditions.
 * @param auctionId The ID of the active auction
 * @param buyerId The ID of the enterprise buyer placing the bid
 * @param buyerName The name of the buyer
 * @param bidAmount The monetary value the buyer is trying to bid
 */
export async function placeBidSafely(
  auctionId: string,
  buyerId: string,
  buyerName: string,
  bidAmount: number
): Promise<BidResult> {
  try {
    const result = await auctionsAPI.placeBid(auctionId, {
      buyerId,
      buyerName,
      bidAmount,
    });

    if (result.error) {
      return {
        success: false,
        message: result.error,
      };
    }

    return {
      success: true,
      message: result.message || 'Bid accepted successfully.',
      newHighestBid: result.newHighestBid,
    };
  } catch (error: any) {
    console.error('Bid failed: ', error);
    return {
      success: false,
      message: error.message || 'Failed to place bid due to high traffic. Try again.',
    };
  }
}

/**
 * Creates a new auction
 */
export async function createAuction(auctionData: {
  cropId: string;
  cropName?: string;
  farmerId: string;
  farmerName?: string;
  quantity: number;
  startingPrice: number;
  endTime: string;
  location?: string;
  description?: string;
}) {
  try {
    const result = await auctionsAPI.create(auctionData);
    return result;
  } catch (error: any) {
    console.error('Create auction failed: ', error);
    throw error;
  }
}

/**
 * Gets all auctions (optionally filtered)
 */
export async function getAuctions(filters?: {
  status?: string;
  cropId?: string;
  farmerId?: string;
}) {
  try {
    const result = await auctionsAPI.getAll(filters || {});
    return result.auctions || [];
  } catch (error: any) {
    console.error('Get auctions failed: ', error);
    return [];
  }
}

/**
 * Gets a single auction by ID
 */
export async function getAuction(auctionId: string) {
  try {
    const result = await auctionsAPI.getById(auctionId);
    return result.auction;
  } catch (error: any) {
    console.error('Get auction failed: ', error);
    return null;
  }
}

/**
 * Gets live auctions
 */
export async function getLiveAuctions() {
  try {
    const result = await auctionsAPI.getLive();
    return result.auctions || [];
  } catch (error: any) {
    console.error('Get live auctions failed: ', error);
    return [];
  }
}