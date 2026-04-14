import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// POST /api/pools/:id/join
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { farmerId, farmerName, quantity } = await req.json();

    if (!farmerId || !quantity) {
      return NextResponse.json({ error: "farmerId and quantity are required" }, { status: 400 });
    }

    const poolRef = adminDb.collection("pools").doc(params.id);
    const poolSnap = await poolRef.get();

    if (!poolSnap.exists) {
      return NextResponse.json({ error: "Pool not found" }, { status: 404 });
    }

    const pool = poolSnap.data()!;

    if (pool.status !== "open") {
      return NextResponse.json({ error: "Pool is not open for joining" }, { status: 400 });
    }

    // Check if farmer already joined
    const alreadyJoined = pool.members?.some((m: any) => m.farmerId === farmerId);
    if (alreadyJoined) {
      return NextResponse.json({ error: "You have already joined this pool" }, { status: 400 });
    }

    const newMember = {
      farmerId,
      farmerName,
      quantity: Number(quantity),
      joinedAt: new Date().toISOString(),
    };

    const newFilledQty = (pool.filledQuantity || 0) + Number(quantity);
    const newStatus = newFilledQty >= pool.targetQuantity ? "filled" : "open";

    await poolRef.update({
      members: FieldValue.arrayUnion(newMember),
      filledQuantity: newFilledQty,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, newStatus, filledQuantity: newFilledQty });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}