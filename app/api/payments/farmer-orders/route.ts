import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

// GET /api/payments/farmer-orders?farmerId=xxx
// Returns token payments awaiting farmer confirmation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get("farmerId");

    if (!farmerId) {
      return NextResponse.json(
        { error: "farmerId is required" },
        { status: 400 },
      );
    }

    // Find pools created by this farmer with token payments
    const poolsSnapshot = await adminDb
      .collection("pools")
      .where("creatorId", "==", farmerId)
      .where("creatorRole", "==", "farmer")
      .get();

    const orders = [];
    const now = new Date().toISOString();

    for (const poolDoc of poolsSnapshot.docs) {
      const poolData = poolDoc.data();

      // Check if there's a token payment for this pool
      const tokenPaymentsSnapshot = await adminDb
        .collection("tokenPayments")
        .where("poolId", "==", poolDoc.id)
        .where("status", "==", "token-paid")
        .get();

      for (const paymentDoc of tokenPaymentsSnapshot.docs) {
        const paymentData = paymentDoc.data();
        // Only show if farmer hasn't confirmed yet
        if (!paymentData.farmerConfirmed && !paymentData.farmerDenied) {
          orders.push({
            orderId: paymentDoc.id,
            poolId: poolDoc.id,
            cropName: poolData.commodity || "Unknown",
            quantity: poolData.filledQuantity || paymentData.quantity || 0,
            pricePerQuintal: poolData.pricePerUnit || 0,
            tokenAmount: paymentData.amount || paymentData.tokenAmount || 0,
            totalAmount: (poolData.filledQuantity || 0) * (poolData.pricePerUnit || 0),
            buyerId: paymentData.buyerId || poolData.buyerId || "",
            buyerName: paymentData.buyerName || poolData.buyerName || "Unknown Buyer",
            status: paymentData.status,
            paidAt: paymentData.paidAt || now,
            createdAt: poolData.createdAt || now,
          });
        }
      }
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("GET /api/payments/farmer-orders error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }
}