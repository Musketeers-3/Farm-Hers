import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

async function sendPaymentNotification(orderData: any) {
  // Send notification to farmer about the token payment
  // orderData contains: poolId, cropName, quantity, pricePerQuintal, farmerId, buyerName, amount
  const notificationRef = await adminDb.collection("notifications").add({
    recipientId: orderData.farmerId,
    type: "payment",
    title: "Token Payment Received",
    message: `New order confirmed — buyer ${orderData.buyerName || "A buyer"} has paid ₹${orderData.tokenAmount} token for ${orderData.quantity} quintals of ${orderData.cropName} at ₹${orderData.pricePerQuintal}/quintal. Check your orders.`,
    poolId: orderData.poolId,
    orderId: orderData.orderId,
    read: false,
    createdAt: new Date().toISOString(),
  });
  return notificationRef.id;
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
          // Store token payment in Firestore
          const paymentRef = adminDb.collection("tokenPayments").doc(orderId);
          await adminDb.runTransaction(async (tx) => {
            const doc = await tx.get(paymentRef);
            if (doc.exists) {
              tx.update(paymentRef, {
                status: "token-paid",
                razorpayPaymentId: payment.id,
                paidAt: new Date().toISOString(),
              });
            } else {
              // Create new payment record if doesn't exist
              tx.set(paymentRef, {
                orderId: orderId,
                poolId: poolId || orderId,
                razorpayOrderId: payment.notes?.razorpay_order_id || "",
                razorpayPaymentId: payment.id,
                status: "token-paid",
                paidAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
              });
            }
          });

          // Find the pool to get farmer details
          if (poolId) {
            try {
              const poolSnap = await adminDb.collection("pools").doc(poolId).get();
              if (poolSnap.exists) {
                const poolData = poolSnap.data();
                await sendPaymentNotification({
                  farmerId: poolData?.creatorId,
                  buyerName: poolData?.buyerName || "A buyer",
                  cropName: poolData?.commodity || "Unknown",
                  quantity: poolData?.filledQuantity || 1,
                  pricePerQuintal: poolData?.pricePerUnit || 0,
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
          await adminDb.collection("tokenPayments").doc(orderId).update({
            status: "failed",
            error: payment.error_description || "Payment failed",
            updatedAt: new Date().toISOString(),
          });
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