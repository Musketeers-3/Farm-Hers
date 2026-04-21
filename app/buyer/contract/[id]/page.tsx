"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { ContractDocument } from "@/components/payment/contract-document";
import type { PaymentOrder } from "@/lib/store";

export default function ContractPage() {
  const params = useParams();
  const router = useRouter();
  const paymentOrders = useAppStore((s) => s.paymentOrders);
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = params.id as string;
    const found = paymentOrders.find((o) => o.id === orderId);
    if (found) {
      setOrder(found);
    }
    setLoading(false);
  }, [params.id, paymentOrders]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0a1409]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-[#0a1409] p-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Order Not Found
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          The contract you're looking for doesn't exist.
        </p>
        <button
          onClick={() => router.push("/buyer")}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return <ContractDocument order={order} />;
}