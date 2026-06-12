export type PaymentStatus =
  | "pending"
  | "processing"
  | "verified"
  | "token-paid"
  | "awaiting-offline"
  | "payment-received"
  | "completed"
  | "failed"
  | "refunded";

export type PaymentMode = "razorpay" | "smart-escrow" | "offline";

export interface TokenPayment {
  id: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  status: PaymentStatus;
  paymentMode: PaymentMode;
  paidAt?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RazorpayPaymentDetails {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  poolId?: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  quantity: number;
  pricePerQuintal: number;
  tokenAmount: number;
  totalAmount: number;
  status: PaymentStatus;
  paymentMode: PaymentMode;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentMethod?: string;
  createdAt: string;
  verifiedAt?: string;
  paidAt?: string;
  updatedAt?: string;
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

export interface VerificationRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  poolDetails?: {
    poolId: string;
    farmerId: string;
    farmerName: string;
    cropName: string;
    quantity: number;
    pricePerQuintal: number;
    tokenAmount: number;
    totalAmount: number;
  };
  buyerId?: string;
  buyerName?: string;
}

export interface VerificationResponse {
  success: boolean;
  orderId?: string;
  message?: string;
  error?: string;
}

export interface WebhookEvent {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: string;
        method?: string;
        error_description?: string;
        notes?: Record<string, string>;
      };
    };
    order?: {
      entity: {
        id: string;
        amount: number;
        status: string;
      };
    };
  };
}

export const TOKEN_AMOUNTS = [500, 1000, 1500, 2000] as const;
export type TokenAmount = typeof TOKEN_AMOUNTS[number];

// Helper type for frontend payment state
export interface PaymentState {
  step: "select" | "processing" | "success" | "failure";
  amount?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  tokenPaymentId?: string;
  error?: string;
  verifiedAt?: string;
}