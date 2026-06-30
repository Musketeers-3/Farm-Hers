import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

// Helper to get auth token from request
const getAuthHeader = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  return authHeader || req.headers.get('Authorization');
};

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const authHeader = getAuthHeader(request);

    const response = await fetch(`${BACKEND_API_URL}/payments/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {})
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
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
    const authHeader = getAuthHeader(request);

    if (orderId) {
      const response = await fetch(`${BACKEND_API_URL}/payments/orders?orderId=${orderId}`, {
        headers: {
          ...(authHeader ? { 'Authorization': authHeader } : {})
        },
      });
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
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
    const authHeader = getAuthHeader(request);

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID required" },
        { status: 400 },
      );
    }

    const response = await fetch(`${BACKEND_API_URL}/payments/orders`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {})
      },
      body: JSON.stringify({ orderId, updates }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to update payment order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 },
    );
  }
}