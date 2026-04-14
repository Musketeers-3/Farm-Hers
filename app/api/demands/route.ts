import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { CreateDemandBody, Demand } from "@/types/demand";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status");
    const snapshot = await (status
      ? adminDb.collection("demands").where("status", "==", status).get()
      : adminDb.collection("demands").get());

    const demands: Demand[] = snapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Demand, "id">) }))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return NextResponse.json({ demands }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/demands error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateDemandBody = await req.json();
    const { cropId, targetQuantity, pricePerQuintal, bonusPerQuintal, deadline, buyerId } = body;

    if (!cropId || !targetQuantity || !pricePerQuintal || !deadline || !buyerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newDemand = {
      cropId,
      targetQuantity,
      filledQuantity: 0,
      pricePerQuintal,
      bonusPerQuintal: bonusPerQuintal ?? 0,
      deadline,
      status: "open",
      buyerId,
      createdAt: now,
      members: [],
      contributors: 0,
    };

    const docRef = await adminDb.collection("demands").add(newDemand);
    return NextResponse.json({ id: docRef.id, ...newDemand }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/demands error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}