import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5001/api';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

async function sendPaymentNotification(orderData: any) {
  try {
    await fetch(`${BACKEND_API_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: orderData.farmerId,
        type: "payment",
        title: "Token Payment Received",
        message: `New order confirmed — buyer ${orderData.buyerName || "A buyer"} has paid ₹${orderData.tokenAmount} token for ${orderData.quantity} quintals of ${orderData.cropName} at ₹${orderData.pricePerQuintal}/quintal. Check your orders.`,
        relatedId: orderData.orderId,
      }),
    });
  } catch (err) {
    console.error("Failed to send payment notification:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 },
      );
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;
        const orderId = payment.notes?.orderId;
        const poolId = payment.notes?.poolId;

        if (orderId) {
          // Update or create payment order via backend API
          try {
            const response = await fetch(`${BACKEND_API_URL}/payments/orders?orderId=${orderId}`);
            const data = await response.json();

            if (data.order) {
              await fetch(`${BACKEND_API_URL}/payments/orders`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId,
                  updates: {
                    status: "token-paid",
                    razorpayPaymentId: payment.id,
                    paidAt: new Date().toISOString(),
                  },
                }),
              });
            } else {
              // Create new payment record if doesn't exist
              await fetch(`${BACKEND_API_URL}/payments/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: orderId,
                  poolId: poolId || orderId,
                  razorpayOrderId: payment.notes?.razorpay_order_id || "",
                  razorpayPaymentId: payment.id,
                  status: "token-paid",
                  paidAt: new Date().toISOString(),
                }),
              });
            }
          } catch (err) {
            console.error("Failed to update payment order:", err);
          }

          // Find the pool to get farmer details
          if (poolId) {
            try {
              const response = await fetch(`${BACKEND_API_URL}/pools/${poolId}`);
              const data = await response.json();

              if (data.pool) {
                await sendPaymentNotification({
                  farmerId: data.pool.creatorId,
                  buyerName: data.pool.buyerName || "A buyer",
                  cropName: data.pool.commodity || "Unknown",
                  quantity: data.pool.filledQuantity || 1,
                  pricePerQuintal: data.pool.pricePerUnit || 0,
                  tokenAmount: payment.amount / 100,
                  poolId: poolId,
                  orderId: orderId,
                });
              }
            } catch (err) {
              console.error("Failed to send payment notification:", err);
            }
          }
        }
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;
        const orderId = payment.notes?.orderId;

        if (orderId) {
          try {
            await fetch(`${BACKEND_API_URL}/payments/orders`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                updates: {
                  status: "failed",
                  error: payment.error_description || "Payment failed",
                  updatedAt: new Date().toISOString(),
                },
              }),
            });
          } catch (err) {
            console.error("Failed to update payment status:", err);
          }
        }
        break;
      }

      default:
        console.log("Unhandled webhook event:", event.event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}