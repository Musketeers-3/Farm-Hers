import { notificationsAPI } from "./api";
import type { NotificationType } from "@/types/notifications";

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
}): Promise<string> {
  const result = await notificationsAPI.create({
    userId: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    relatedId: params.relatedId,
  });

  return result.id;
}