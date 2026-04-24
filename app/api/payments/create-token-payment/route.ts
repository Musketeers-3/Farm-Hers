import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

// POST /api/payments/create-token-payment
// Creates a token payment record when buyer commits via Smart Escrow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      poolId,
      buyerId,
      buyerName,
      farmerId,
      farmerName,
      cropName,
      quantity,
      pricePerQuintal,
      tokenAmount,
      totalAmount,
      razorpayOrderId,
      razorpayPaymentId,
      paymentMode, // "razorpay" or "smart_escrow"
    } = body;

    if (!poolId || !buyerId || !farmerId || !tokenAmount) {
      return NextResponse.json(
        { error: "Missing required fields: poolId, buyerId, farmerId, tokenAmount" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const orderId = `TP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create the token payment record
    const paymentRef = adminDb.collection("tokenPayments").doc(orderId);
    await paymentRef.set({
      orderId: orderId,
      poolId: poolId,
      buyerId: buyerId,
      buyerName: buyerName || "Unknown Buyer",
      farmerId: farmerId,
      farmerName: farmerName || "Unknown Farmer",
      cropName: cropName || "Unknown",
      quantity: quantity || 0,
      pricePerQuintal: pricePerQuintal || 0,
      tokenAmount: tokenAmount,
      totalAmount: totalAmount || quantity * pricePerQuintal,
      razorpayOrderId: razorpayOrderId || `escrow_${Date.now()}`,
      razorpayPaymentId: razorpayPaymentId || `pay_${Date.now()}`,
      paymentMode: paymentMode || "smart_escrow",
      status: "token-paid",
      farmerConfirmed: false,
      farmerDenied: false,
      paidAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Update the pool with buyer info and mark as token-paid
    await adminDb.collection("pools").doc(poolId).update({
      buyerId: buyerId,
      buyerName: buyerName || "Unknown Buyer",
      tokenAmount: tokenAmount,
      status: "token-paid",
      updatedAt: now,
    });

    // Send notification to farmer
    await adminDb.collection("notifications").add({
      recipientId: farmerId,
      type: "payment",
      title: "New Order Confirmed",
      message: `New order confirmed — buyer ${buyerName || "A buyer"} has paid ₹${tokenAmount} token for ${quantity || "some"} quintals of ${cropName || "crop"} at ₹${pricePerQuintal || 0}/quintal. Check your orders.`,
      poolId: poolId,
      orderId: orderId,
      read: false,
      createdAt: now,
    });

    return NextResponse.json({
      success: true,
      orderId: orderId,
      status: "token-paid",
    });
  } catch (error: any) {
    console.error("POST /api/payments/create-token-payment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create token payment" },
      { status: 500 },
    );
  }
}