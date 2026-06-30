import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

// Helper to get auth token from request
const getAuthHeader = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  return authHeader || req.headers.get('Authorization');
};

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status");
    const params: Record<string, string> = {};
    if (status) params.status = status;

    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${BACKEND_API_URL}/demands${query ? `?${query}` : ''}`);
    const data = await response.json();

    return NextResponse.json({ demands: data.demands }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/demands error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = getAuthHeader(req);

    const response = await fetch(`${BACKEND_API_URL}/demands`, {
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
    console.error("POST /api/demands error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}