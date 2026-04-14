// lib/auction-engine.ts
import { db } from "./firebase"; // Adjust import to your config
import { doc, collection, runTransaction, serverTimestamp } from "firebase/firestore";

export interface BidResult {
  success: boolean;
  message: string;
  newHighestBid?: number;
}

/**
 * Safely processes a live bid, preventing race conditions.
 * @param auctionId The ID of the active auction
 * @param buyerId The ID of the enterprise buyer placing the bid
 * @param bidAmount The monetary value the buyer is trying to bid
 */
export async function placeBidSafely(
  auctionId: string, 
  buyerId: string, 
  bidAmount: number
): Promise<BidResult> {
  const auctionRef = doc(db, "auctions", auctionId);
  const bidHistoryRef = doc(collection(auctionRef, "history"));

  try {
    await runTransaction(db, async (transaction) => {
      const auctionDoc = await transaction.get(auctionRef);
      
      if (!auctionDoc.exists()) {
        throw new Error("Auction does not exist.");
      }

      const data = auctionDoc.data();
      const currentHighestBid = data.currentBid || data.startingPrice;
      const status = data.status;

      // 1. Hard Constraints
      if (status !== 'active') {
        throw new Error("This auction has already closed.");
      }

      if (bidAmount <= currentHighestBid) {
        throw new Error(`Bid rejected. The current highest bid is already ₹${currentHighestBid}.`);
      }

      // 2. The Atomic Write
      // This only executes if the read data hasn't been changed by another thread
      transaction.update(auctionRef, {
        currentBid: bidAmount,
        highestBidder: buyerId,
        lastBidTime: serverTimestamp()
      });

      // 3. The Audit Trail
      // We log every single bid to a subcollection for the scrolling UI history
      transaction.set(bidHistoryRef, {
        buyerId: buyerId,
        amount: bidAmount,
        timestamp: serverTimestamp(),
        isLeading: true // Front-end uses this to style the text green
      });
    });

    return { 
      success: true, 
      message: "Bid accepted successfully.",
      newHighestBid: bidAmount
    };

  } catch (error: any) {
    console.error("Transaction failed: ", error);
    return { 
      success: false, 
      message: error.message || "Failed to place bid due to high traffic. Try again."
    };
  }
}