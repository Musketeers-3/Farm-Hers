import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Pool } from "@/types/pool";

// GET /api/pools/[id] — get a single pool by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. Type it as a Promise
) {
  try {
    const { id } = await params; // 2. Await the params before using them

    const doc = await adminDb.collection("pools").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Pool not found" }, { status: 404 });
    }

    const pool: Pool = { id: doc.id, ...(doc.data() as Omit<Pool, "id">) };
    return NextResponse.json({ pool }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/pools/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}