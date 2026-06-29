import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

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
      // Update payment status via backend API
      await fetch(`${BACKEND_API_URL}/payments/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          updates: {
            farmerConfirmed: true,
            farmerConfirmedAt: now,
            farmerNotes: notes || null,
            status: "awaiting-offline",
          },
        }),
      });

      // Update the pool status via backend API
      await fetch(`${BACKEND_API_URL}/pools/${poolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerConfirmedPayment: true,
          farmerConfirmedAt: now,
          updatedAt: now,
        }),
      });

      // Send notification to buyer
      await fetch(`${BACKEND_API_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: buyerId,
          type: "payment",
          title: "Order Confirmed!",
          message: "Your order is confirmed! Farmer has acknowledged the deal. Proceed with full payment via cheque/NEFT.",
          relatedId: orderId,
        }),
      });

      return NextResponse.json({
        success: true,
        message: "Payment confirmed. Farmer notified.",
        status: "awaiting-offline",
      });
    } else {
      // Farmer denied receiving payment
      await fetch(`${BACKEND_API_URL}/payments/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          updates: {
            farmerConfirmed: false,
            farmerDeniedAt: now,
            farmerNotes: notes || "Payment not received",
            status: "payment-disputed",
          },
        }),
      });

      // Update the pool
      await fetch(`${BACKEND_API_URL}/pools/${poolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerConfirmedPayment: false,
          farmerDeniedAt: now,
          updatedAt: now,
        }),
      });

      // Send notification to buyer about the dispute
      await fetch(`${BACKEND_API_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: buyerId,
          type: "payment",
          title: "Payment Dispute Raised",
          message: "Farmer has raised a concern about payment. Please contact support or re-submit your payment reference.",
          relatedId: orderId,
        }),
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

    const response = await fetch(`${BACKEND_API_URL}/payments/orders?orderId=${orderId}`);
    const data = await response.json();

    if (!data.order) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      orderId: data.order.id,
      status: data.order.status,
      farmerConfirmed: data.order.farmerConfirmed || false,
      farmerConfirmedAt: data.order.farmerConfirmedAt || null,
      farmerDeniedAt: data.order.farmerDeniedAt || null,
      farmerNotes: data.order.farmerNotes || null,
    });
  } catch (error: any) {
    console.error("GET /api/payments/confirm-receipt error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payment status" },
      { status: 500 },
    );
  }
}