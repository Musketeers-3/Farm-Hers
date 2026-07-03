import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5001/api';

// GET /api/pools/[id] — get a single pool by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await fetch(`${BACKEND_API_URL}/pools/${id}`);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("GET /api/pools/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}