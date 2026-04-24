export type NotificationType =
  | "pool_join"
  | "demand_join"
  | "order_update"
  | "payment"
  | "auction_bid"
  | "price_alert";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  read: boolean;
  createdAt: string;
}
