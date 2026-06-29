import { NextRequest, NextResponse } from "next/server";

// Backend API URL - change this to your backend URL in production
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

// GET /api/pools?status=open&commodity=wheat&creatorRole=buyer
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params: Record<string, string> = {};

    const status = searchParams.get("status");
    const commodity = searchParams.get("commodity");
    const creatorRole = searchParams.get("creatorRole");

    if (status) params.status = status;
    if (commodity) params.commodity = commodity;
    if (creatorRole) params.creatorRole = creatorRole;

    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${BACKEND_API_URL}/pools${query ? `?${query}` : ''}`);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("GET /api/pools Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/pools — create a pool (buyer OR farmer)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${BACKEND_API_URL}/pools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("POST /api/pools Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}