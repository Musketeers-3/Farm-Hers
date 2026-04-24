import { adminDb } from "./firebase-admin";
import type { NotificationType } from "@/types/notifications";

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
}): Promise<string> {
  const docRef = await adminDb.collection("notifications").add({
    userId: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    relatedId: params.relatedId || null,
    read: false,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}
