import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

// GET /api/payments/farmer-orders?farmerId=xxx
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

    const response = await fetch(`${BACKEND_API_URL}/payments/farmer-orders/${farmerId}`);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("GET /api/payments/farmer-orders error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }
}