import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    const ordersRef = collection(db, "paymentOrders");
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      status: orderData.status || "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      orderId: docRef.id,
    });
  } catch (error) {
    console.error("Failed to create payment order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (orderId) {
      const orderDoc = await getDoc(doc(db, "paymentOrders", orderId));
      if (orderDoc.exists()) {
        return NextResponse.json({
          success: true,
          order: { id: orderDoc.id, ...orderDoc.data() },
        });
      }
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: false,
      error: "Order ID required",
    });
  } catch (error) {
    console.error("Failed to fetch payment order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, updates } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID required" },
        { status: 400 },
      );
    }

    const orderRef = doc(db, "paymentOrders", orderId);
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update payment order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 },
    );
  }
}