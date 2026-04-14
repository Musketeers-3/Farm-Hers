import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin"; // adjust to your firebase admin import
import { Pool, PoolCreatorRole } from "@/types/pool";

// GET /api/pools?status=open&commodity=wheat&creatorRole=buyer
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const commodity = searchParams.get("commodity");
    const creatorRole = searchParams.get("creatorRole") as PoolCreatorRole | null;

    let query = adminDb.collection("pools").orderBy("createdAt", "desc");

    if (status) query = query.where("status", "==", status) as any;
    if (commodity) query = query.where("commodity", "==", commodity) as any;
    if (creatorRole) query = query.where("creatorRole", "==", creatorRole) as any;

    const snapshot = await query.get();
    const pools = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ pools });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/pools — create a pool (buyer OR farmer)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      creatorId,
      creatorRole, // "buyer" | "farmer"
      creatorName,
      commodity,
      pricePerUnit,
      unit,
      targetQuantity,
      requestedQuantity, // only for buyer-created
      deadline,
      location,
      description,
    } = body;

    if (!creatorId || !creatorRole || !commodity || !pricePerUnit || !targetQuantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newPool: Omit<Pool, "id"> = {
      creatorId,
      creatorRole,
      creatorName,
      commodity,
      pricePerUnit: Number(pricePerUnit),
      unit: unit || "kg",
      targetQuantity: Number(targetQuantity),
      requestedQuantity: requestedQuantity ? Number(requestedQuantity) : undefined,
      filledQuantity: 0,
      members: [],
      status: "open",
      deadline: deadline || null,
      location: location || null,
      description: description || null,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection("pools").add(newPool);
    return NextResponse.json({ id: docRef.id, ...newPool }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}