import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

// Helper to get auth token from request
const getAuthHeader = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  return authHeader || req.headers.get('Authorization');
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;
    const authHeader = getAuthHeader(req);

    const response = await fetch(`${BACKEND_API_URL}/demands/${id}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {})
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("POST /api/demands/[id]/join error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}