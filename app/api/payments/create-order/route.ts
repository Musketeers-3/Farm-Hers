import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    console.log("Creating Razorpay order with:", {
      key_id: RAZORPAY_KEY_ID ? "set" : "missing",
      key_secret: RAZORPAY_KEY_SECRET ? "set" : "missing",
    });

    const { amount, receipt } = await request.json();

    if (!amount || amount < 100) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 },
      );
    }

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials missing:", {
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      });
      return NextResponse.json(
        { success: false, error: "Payment gateway not configured" },
        { status: 500 },
      );
    }

    const instance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const receiptId = (receipt || `receipt_${Date.now()}`).slice(0, 40);

    const order = await instance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: receiptId,
      payment_capture: 1,
      notes: {
        platform: "AgriLink",
        type: "token_payment",
        orderId: receipt,
      },
    });

    console.log("Razorpay order created:", order.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error.message || error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create payment order",
      },
      { status: 500 },
    );
  }
}
