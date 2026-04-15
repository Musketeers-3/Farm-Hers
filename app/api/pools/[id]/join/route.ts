import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// POST /api/pools/[id]/join
export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // ⚡ Next.js 15 Promise type
) {
  try {
    const { farmerId, farmerName, quantity } = await req.json();
    const { id } = await params; // ⚡ Await the params

    if (!farmerId || !quantity) {
      return NextResponse.json({ error: "farmerId and quantity are required" }, { status: 400 });
    }

    const poolRef = adminDb.collection("pools").doc(id);

    // ==========================================
    // THE ALGORITHMIC OVERRIDE: Concurrency Lock
    // ==========================================
    const result = await adminDb.runTransaction(async (transaction) => {
      const poolSnap = await transaction.get(poolRef);

      if (!poolSnap.exists) {
        throw new Error("Pool not found");
      }

      const pool = poolSnap.data()!;

      if (pool.status !== "open") {
        throw new Error("Pool is not open for joining");
      }

      // Check if farmer already joined
      const alreadyJoined = pool.members?.some((m: any) => m.farmerId === farmerId);
      if (alreadyJoined) {
        throw new Error("You have already joined this pool");
      }

      const numQuantity = Number(quantity);
      const newFilledQty = (pool.filledQuantity || 0) + numQuantity;
      
      // Ensure we don't accidentally overfill a premium buyer's contract
      if (newFilledQty > pool.targetQuantity) {
         throw new Error(`Cannot join. Only ${pool.targetQuantity - (pool.filledQuantity || 0)} quintals remaining in this pool.`);
      }

      // Using "fulfilled" to match our store schema strictly
      const newStatus = newFilledQty === pool.targetQuantity ? "fulfilled" : "open";

      const newMember = {
        farmerId,
        farmerName,
        quantity: numQuantity,
        joinedAt: new Date().toISOString(),
      };

      transaction.update(poolRef, {
        members: FieldValue.arrayUnion(newMember),
        filledQuantity: newFilledQty,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      return { newStatus, newFilledQty };
    });

    return NextResponse.json({ 
      success: true, 
      newStatus: result.newStatus, 
      filledQuantity: result.newFilledQty 
    });

  } catch (error: any) {
    console.error("Pool join error:", error.message);
    const statusCode = error.message.includes("found") ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status: statusCode });
  }
}