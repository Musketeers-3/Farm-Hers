import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { createNotification } from "@/lib/notifications";
import type { Notification, NotificationType } from "@/types/notifications";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const readFilter = req.nextUrl.searchParams.get("read");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    let query: FirebaseFirestore.Query = adminDb
      .collection("notifications")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc");

    if (readFilter === "true") {
      query = query.where("read", "==", true);
    } else if (readFilter === "false") {
      query = query.where("read", "==", false);
    }

    const snapshot = await query.get();
    const notifications: Notification[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Notification, "id">),
    }));

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, type, title, message, relatedId } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: "userId, type, title, and message are required" },
        { status: 400 },
      );
    }

    const id = await createNotification({ userId, type, title, message, relatedId });

    return NextResponse.json({ id, userId, type, title, message, relatedId, read: false, createdAt: new Date().toISOString() }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
