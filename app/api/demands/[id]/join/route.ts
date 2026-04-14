import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { JoinDemandBody } from "@/types/demand";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: JoinDemandBody = await req.json();
    const { farmerId, quantity } = body;

    if (!farmerId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const demandRef = adminDb.collection("demands").doc(id);

    const result = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(demandRef);
      if (!snap.exists) throw new Error("Demand not found");

      const data = snap.data()!;
      if (data.status !== "open") throw new Error("Demand is no longer open");

      const alreadyJoined = (data.members || []).some((m: any) => m.farmerId === farmerId);
      if (alreadyJoined) throw new Error("You have already joined this demand");

      const remaining = data.targetQuantity - data.filledQuantity;
      if (quantity > remaining) throw new Error(`Only ${remaining}q remaining in this demand`);

      const newFilled = data.filledQuantity + quantity;
      const newStatus = newFilled >= data.targetQuantity ? "filled" : "open";

      tx.update(demandRef, {
        filledQuantity: newFilled,
        contributors: (data.contributors || 0) + 1,
        status: newStatus,
        members: [...(data.members || []), { farmerId, quantity, joinedAt: new Date().toISOString() }],
      });

      return { filledQuantity: newFilled, status: newStatus };
    });

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/demands/[id]/join error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}