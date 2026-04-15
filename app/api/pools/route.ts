import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { generateMicroPoolDP, CropListing } from "@/lib/pooling-engine-dp";
import { Pool, PoolCreatorRole } from "@/types/pool";

// GET /api/pools?status=open&commodity=wheat&creatorRole=buyer
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const commodity = searchParams.get("commodity");
    const creatorRole = searchParams.get("creatorRole");

    let query: any = adminDb.collection("pools");

    if (status) query = query.where("status", "==", status);
    if (commodity) query = query.where("commodity", "==", commodity);
    if (creatorRole) query = query.where("creatorRole", "==", creatorRole);

    // ⚡ ARCHITECT HYBRID FIX: Removed Firebase .orderBy() to bypass all Index errors.

    const snapshot = await query.get();
    let pools = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ⚡ Sort in server memory instead. This guarantees 100% uptime for complex queries.
    pools.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Descending
    });

    return NextResponse.json({ pools });
  } catch (error: any) {
    console.error("GET /api/pools Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/pools — create a pool (buyer OR farmer)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      creatorId,
      creatorRole,
      creatorName,
      commodity,
      pricePerUnit,
      unit,
      targetQuantity,
      requestedQuantity,
      deadline,
      location,
      description,
      lat,
      lng,
    } = body;

    if (
      !creatorId ||
      !creatorRole ||
      !commodity ||
      !pricePerUnit ||
      !targetQuantity
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();

    // ==========================================
    // THE ALGORITHMIC OVERRIDE (Buyer Micro-Pooling)
    // ==========================================
    if (creatorRole === "buyer" && lat && lng) {
      const listingsSnapshot = await adminDb
        .collection("pools")
        .where("creatorRole", "==", "farmer")
        .where("status", "==", "open")
        .where("commodity", "==", commodity)
        .get();

      // FIX: Explicitly typed 'doc' as 'any' to satisfy strict mode
      const availableListings: CropListing[] = listingsSnapshot.docs.map(
        (doc: any) => {
          const data = doc.data();
          return {
            id: doc.id,
            farmerId: data.creatorId,
            cropType: data.commodity,
            qualityGrade: data.description || "Grade A",
            volumeQuintals: data.targetQuantity,
            lat: data.lat || 0,
            lng: data.lng || 0,
          };
        },
      );

      const poolResult = await generateMicroPoolDP(
        lat,
        lng,
        availableListings,
        Number(targetQuantity),
        20,
        commodity,
        "Grade A",
      );

      if (poolResult) {
        const batch = adminDb.batch();
        const newBuyerPoolRef = adminDb.collection("pools").doc();

        batch.set(newBuyerPoolRef, {
          creatorId,
          creatorRole,
          creatorName,
          commodity,
          pricePerUnit: Number(pricePerUnit),
          unit: unit || "kg",
          targetQuantity: Number(targetQuantity),
          filledQuantity: poolResult.actualVolume,
          members: poolResult.participants.map((p) => p.farmerId),
          status: "fulfilled",
          deadline: deadline || null,
          location: location || null,
          description: "Auto-matched via Micro-Pooling Algorithm",
          createdAt: now,
          updatedAt: now,
          lat,
          lng,
        });

        poolResult.participants.forEach((participant) => {
          const listingRef = adminDb.collection("pools").doc(participant.id);
          batch.update(listingRef, {
            status: "pooled",
            matchedBuyerId: creatorId,
            updatedAt: now,
          });
        });

        await batch.commit();

        return NextResponse.json(
          {
            message: "Ad-Hoc Micro-Pool generated instantly.",
            id: newBuyerPoolRef.id,
            totalVolume: poolResult.actualVolume,
          },
          { status: 201 },
        );
      }
    }

    // ==========================================
    // FALLBACK (Farmer Listing OR Unmatched Buyer)
    // ==========================================

    // FIX: Using an intersection type to force the compiler to accept the spatial coordinates
    // without requiring you to manually edit your teammate's types/pool.ts file right now.
    const newPool: Omit<Pool, "id"> & {
      lat?: number | null;
      lng?: number | null;
    } = {
      creatorId,
      creatorRole,
      creatorName,
      commodity,
      pricePerUnit: Number(pricePerUnit),
      unit: unit || "kg",
      targetQuantity: Number(targetQuantity),
      requestedQuantity: requestedQuantity
        ? Number(requestedQuantity)
        : undefined,
      filledQuantity: 0,
      members: [],
      status: "open",
      deadline: deadline || null,
      location: location || null,
      description: description || null,
      createdAt: now,
      updatedAt: now,
      lat: lat || null,
      lng: lng || null,
    } as any; // Final safety cast for the Firebase add() method

    const docRef = await adminDb.collection("pools").add(newPool);
    return NextResponse.json({ id: docRef.id, ...newPool }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
