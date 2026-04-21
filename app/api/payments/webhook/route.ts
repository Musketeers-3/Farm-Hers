import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, collection, addDoc } from "firebase/firestore";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

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

        if (orderId) {
          const paymentsRef = collection(db, "tokenPayments");
          const paymentDoc = await getDoc(doc(paymentsRef, orderId));

          if (paymentDoc.exists()) {
            await updateDoc(doc(paymentsRef, orderId), {
              status: "token-paid",
              razorpayPaymentId: payment.id,
              paidAt: new Date().toISOString(),
            });
          }
        }
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;
        const orderId = payment.notes?.orderId;

        if (orderId) {
          const paymentsRef = collection(db, "tokenPayments");
          await updateDoc(doc(paymentsRef, orderId), {
            status: "failed",
            error: payment.error_description,
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