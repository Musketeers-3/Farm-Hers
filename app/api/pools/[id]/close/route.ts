import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

// POST /api/pools/[id]/close
export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // ⚡ Next.js 15 Promise type
) {
  try {
    const { userId } = await req.json();
    const { id } = await params; // ⚡ Await the params

    const poolRef = adminDb.collection("pools").doc(id);
    const poolSnap = await poolRef.get();

    if (!poolSnap.exists) {
      return NextResponse.json({ error: "Pool not found" }, { status: 404 });
    }

    const pool = poolSnap.data()!;
    
    // Strict Authorization check
    if (pool.creatorId !== userId) {
      return NextResponse.json({ error: "Only the creator can close this pool" }, { status: 403 });
    }

    await poolRef.update({ 
      status: "closed", 
      updatedAt: new Date().toISOString() 
    });
    
    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}