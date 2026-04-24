import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

interface ConfirmReceiptRequest {
  poolId: string;
  orderId: string;
  farmerId: string;
  buyerId: string;
  confirmed: boolean;
  notes?: string;
}

// POST /api/payments/confirm-receipt
// Farmer confirms or denies receiving the payment
export async function POST(request: NextRequest) {
  try {
    const body: ConfirmReceiptRequest = await request.json();
    const { poolId, orderId, farmerId, buyerId, confirmed, notes } = body;

    if (!poolId || !orderId || !farmerId || !buyerId) {
      return NextResponse.json(
        { error: "Missing required fields: poolId, orderId, farmerId, buyerId" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();

    if (confirmed) {
      // Update payment status to awaiting offline payment
      await adminDb.collection("tokenPayments").doc(orderId).update({
        farmerConfirmed: true,
        farmerConfirmedAt: now,
        farmerNotes: notes || null,
        status: "awaiting-offline",
      });

      // Update the pool status
      await adminDb.collection("pools").doc(poolId).update({
        farmerConfirmedPayment: true,
        farmerConfirmedAt: now,
        updatedAt: now,
      });

      // Send notification to buyer that farmer confirmed
      await adminDb.collection("notifications").add({
        userId: buyerId,
        type: "payment",
        title: "Order Confirmed!",
        message: "Your order is confirmed! Farmer has acknowledged the deal. Proceed with full payment via cheque/NEFT.",
        relatedId: orderId,
        read: false,
        createdAt: now,
      });

      return NextResponse.json({
        success: true,
        message: "Payment confirmed. Farmer notified.",
        status: "awaiting-offline",
      });
    } else {
      // Farmer denied receiving payment
      await adminDb.collection("tokenPayments").doc(orderId).update({
        farmerConfirmed: false,
        farmerDeniedAt: now,
        farmerNotes: notes || "Payment not received",
        status: "payment-disputed",
      });

      // Update the pool
      await adminDb.collection("pools").doc(poolId).update({
        farmerConfirmedPayment: false,
        farmerDeniedAt: now,
        updatedAt: now,
      });

      // Send notification to buyer about the dispute
      await adminDb.collection("notifications").add({
        userId: buyerId,
        type: "payment",
        title: "Payment Dispute Raised",
        message: "Farmer has raised a concern about payment. Please contact support or re-submit your payment reference.",
        relatedId: orderId,
        read: false,
        createdAt: now,
      });

      return NextResponse.json({
        success: true,
        message: "Dispute recorded. Buyer notified.",
        status: "payment-disputed",
      });
    }
  } catch (error: any) {
    console.error("POST /api/payments/confirm-receipt error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process confirmation" },
      { status: 500 },
    );
  }
}

// GET /api/payments/confirm-receipt?orderId=xxx - check status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 },
      );
    }

    const doc = await adminDb.collection("tokenPayments").doc(orderId).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 },
      );
    }

    const data = doc.data();
    return NextResponse.json({
      orderId: doc.id,
      status: data?.status,
      farmerConfirmed: data?.farmerConfirmed || false,
      farmerConfirmedAt: data?.farmerConfirmedAt || null,
      farmerDeniedAt: data?.farmerDeniedAt || null,
      farmerNotes: data?.farmerNotes || null,
    });
  } catch (error: any) {
    console.error("GET /api/payments/confirm-receipt error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payment status" },
      { status: 500 },
    );
  }
}