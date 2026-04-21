"use client";

import type { TokenAmount } from "@/types/payment";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY_ID = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "")
  : "";

let razorpayLoaded = false;

export async function loadRazorpayScript(): Promise<boolean> {
  if (razorpayLoaded) return true;
  if (typeof window === "undefined") return false;

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      razorpayLoaded = true;
      resolve(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

interface PaymentOptions {
  amount: number;
  orderId: string;
  name: string;
  email: string;
  phone: string;
  description?: string;
}

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}

export async function initiatePayment(
  options: PaymentOptions,
): Promise<PaymentResult> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    return { success: false, error: "Payment gateway not loaded" };
  }

  return new Promise((resolve) => {
    const razorpay = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: options.amount * 100,
      currency: "INR",
      name: "AgriLink",
      description: options.description || "Token Payment for Agricultural Deal",
      order_id: options.orderId,
      handler: (response: any) => {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        });
      },
      prefill: {
        name: options.name,
        email: options.email,
        contact: options.phone,
      },
      theme: {
        color: "#16a34a",
        hide_topbar: false,
      },
      modal: {
        ondismiss: () => {
          resolve({ success: false, error: "Payment cancelled" });
        },
      },
    });

    razorpay.open();
  });
}

export async function createRazorpayOrder(
  amount: number,
  receipt: string,
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const response = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, receipt }),
    });

    const data = await response.json();
    if (data.success && data.orderId) {
      return { success: true, orderId: data.orderId };
    }
    return { success: false, error: data.error || "Failed to create order" };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      }),
    });

    const data = await response.json();
    return { success: data.success, error: data.error };
  } catch (error) {
    return { success: false, error: "Verification failed" };
  }
}

export function isRazorpayConfigured(): boolean {
  return !!RAZORPAY_KEY_ID;
}