import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await req.json();
    const poolRef = adminDb.collection("pools").doc(params.id);
    const poolSnap = await poolRef.get();

    if (!poolSnap.exists) return NextResponse.json({ error: "Pool not found" }, { status: 404 });

    const pool = poolSnap.data()!;
    if (pool.creatorId !== userId) {
      return NextResponse.json({ error: "Only the creator can close this pool" }, { status: 403 });
    }

    await poolRef.update({ status: "closed", updatedAt: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}