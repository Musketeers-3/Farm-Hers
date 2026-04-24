import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notifRef = adminDb.collection("notifications").doc(id);

    const doc = await notifRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    await notifRef.update({ read: true });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/notifications/[id]/read error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
