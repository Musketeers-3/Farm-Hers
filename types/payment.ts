export type PaymentStatus =
  | "pending"
  | "token-paid"
  | "awaiting-offline"
  | "payment-received"
  | "completed";

export interface TokenPayment {
  id: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
}

export interface OfflinePayment {
  orderId: string;
  mode: "cheque" | "neft" | "upi";
  reference: string;
  submittedAt: string;
  farmerConfirmed: boolean;
  confirmedAt?: string;
  farmerNotes?: string;
}

export interface PaymentOrder {
  id: string;
  cropId: string;
  cropName: string;
  quantity: number;
  pricePerQuintal: number;
  totalAmount: number;
  tokenAmount: number;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  farmerId: string;
  farmerName: string;
  poolId?: string;
  status: PaymentStatus;
  tokenPayment?: TokenPayment;
  offlinePayment?: OfflinePayment;
  createdAt: string;
  updatedAt: string;
  contractGeneratedAt?: string;
}

export const TOKEN_AMOUNTS = [500, 1000, 1500, 2000] as const;
export type TokenAmount = typeof TOKEN_AMOUNTS[number];