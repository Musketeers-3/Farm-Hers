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

    const snapshot = await query.get();
    let pools = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    pools.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
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

    if (!creatorId || !creatorRole || !commodity || !pricePerUnit) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // ==========================================
    // BUYER MICRO-POOLING (only when lat/lng provided)
    // ==========================================
    if (creatorRole === "buyer" && lat && lng) {
      const listingsSnapshot = await adminDb
        .collection("pools")
        .where("creatorRole", "==", "farmer")
        .where("status", "==", "open")
        .where("commodity", "==", commodity)
        .get();

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
        }
      );

      const poolResult = await generateMicroPoolDP(
        lat,
        lng,
        availableListings,
        Number(targetQuantity || requestedQuantity),
        20,
        commodity,
        "Grade A"
      );

      if (poolResult) {
        const batch = adminDb.batch();
        const newBuyerPoolRef = adminDb.collection("pools").doc();

        batch.set(newBuyerPoolRef, {
          creatorId,
          creatorRole,
          creatorName: creatorName || "Unknown Buyer",
          commodity,
          pricePerUnit: Number(pricePerUnit),
          unit: unit || "quintal",
          targetQuantity: Number(targetQuantity || requestedQuantity) || 0,
          requestedQuantity: Number(requestedQuantity || targetQuantity) || 0,
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
          { status: 201 }
        );
      }
    }

    // ==========================================
    // FALLBACK — Farmer Listing OR Unmatched Buyer
    // Creates an open pool visible to the other side
    // ==========================================
    const sanitizedPool: any = {
      creatorId,
      creatorRole,
      creatorName: creatorName || "Unknown",
      commodity,
      pricePerUnit: Number(pricePerUnit) || 0,
      unit: unit || "quintal",
      targetQuantity: Number(targetQuantity) || Number(requestedQuantity) || 0,
      requestedQuantity: Number(requestedQuantity) || Number(targetQuantity) || 0,
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
    };

    // Safety sweep: remove any key that is still undefined
    Object.keys(sanitizedPool).forEach((key) => {
      if (sanitizedPool[key] === undefined) {
        delete sanitizedPool[key];
      }
    });

    const docRef = await adminDb.collection("pools").add(sanitizedPool);
    return NextResponse.json({ id: docRef.id, ...sanitizedPool }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/pools Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}