import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

// POST /api/pools/[id]/close
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await fetch(`${BACKEND_API_URL}/pools/${id}/close`, {
      method: 'POST',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Pool close error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}