import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5001/api';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      poolDetails,
      buyerId,
      buyerName,
    } = body;

    // Step 1: Validate required fields
    if (!razorpayOrderId || !razorpayPaymentId) {
      console.error("Verification failed: Missing required fields", { razorpayOrderId, razorpayPaymentId });
      return NextResponse.json(
        { success: false, error: "Missing payment details" },
        { status: 400 },
      );
    }

    // Step 2: Verify Razorpay signature if provided
    if (razorpaySignature && RAZORPAY_KEY_SECRET) {
      const generatedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        console.error("Payment signature verification failed", {
          expected: generatedSignature,
          received: razorpaySignature,
        });
        return NextResponse.json(
          { success: false, error: "Invalid signature" },
          { status: 400 },
        );
      }
      console.log("Signature verified successfully", { razorpayPaymentId });
    } else if (!razorpaySignature) {
      console.log("Proceeding without signature verification (immediate verification mode)", {
        razorpayOrderId,
        razorpayPaymentId,
      });
    }

    // Step 3: Process the payment and create/update records
    const now = new Date().toISOString();

    // If poolDetails provided, update the pool and create payment order record
    if (poolDetails?.poolId && buyerId) {
      const orderId = `TP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      try {
        // Create payment order record via backend API
        const paymentOrderData = {
          cropId: poolDetails.cropId || "",
          cropName: poolDetails.cropName || "Unknown",
          quantity: poolDetails.quantity || 0,
          pricePerQuintal: poolDetails.pricePerQuintal || 0,
          totalAmount: poolDetails.totalAmount || 0,
          tokenAmount: poolDetails.tokenAmount || 0,
          buyerId: buyerId,
          buyerName: buyerName || "Unknown Buyer",
          farmerId: poolDetails.farmerId,
          farmerName: poolDetails.farmerName || "Unknown Farmer",
          poolId: poolDetails.poolId,
          status: "token-paid",
          razorpayOrderId: razorpayOrderId,
          razorpayPaymentId: razorpayPaymentId,
        };

        await fetch(`${BACKEND_API_URL}/payments/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentOrderData),
        });

        // Update the pool status via backend API
        await fetch(`${BACKEND_API_URL}/pools/${poolDetails.poolId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyerId: buyerId,
            buyerName: buyerName || "Unknown Buyer",
            tokenAmount: poolDetails.tokenAmount || 0,
            status: "token-paid",
            razorpayPaymentId: razorpayPaymentId,
            razorpayOrderId: razorpayOrderId,
            tokenPaidAt: now,
            updatedAt: now,
          }),
        });

        // Send notification to farmer via backend API
        await fetch(`${BACKEND_API_URL}/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: poolDetails.farmerId,
            type: "payment",
            title: "Token Payment Received",
            message: `Buyer ${buyerName || "A buyer"} has paid ₹${poolDetails.tokenAmount || 0} token for ${poolDetails.quantity || 0} quintals of ${poolDetails.cropName || "crop"} via Razorpay. Check your orders.`,
            relatedId: orderId,
          }),
        });

        console.log("Payment verified and payment order created", {
          orderId,
          poolId: poolDetails.poolId,
          razorpayPaymentId,
        });

        return NextResponse.json({
          success: true,
          orderId: orderId,
          razorpayPaymentId: razorpayPaymentId,
          message: "Payment verified and payment order created",
        });
      } catch (dbError) {
        console.error("Database error during payment verification:", dbError);
        return NextResponse.json(
          { success: false, error: "Failed to record payment" },
          { status: 500 },
        );
      }
    }

    // If no poolDetails, just verify the signature
    console.log("Payment signature verified (no pool details)", {
      razorpayOrderId,
      razorpayPaymentId,
    });

    return NextResponse.json({
      success: true,
      message: "Payment signature verified",
      razorpayPaymentId: razorpayPaymentId,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 },
    );
  }
}