"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import { Pool } from "@/types/pool";

export default function FarmerPools() {
  const { user: authUser, authReady } = useCurrentUser();
  const farmer = {
    id: authUser?.uid ?? "",
    name: authUser?.displayName ?? authUser?.email ?? "Farmer",
  };
  const [pools, setPools] = useState<Pool[]>([]);
  const [tab, setTab] = useState<"browse" | "mine" | "create">("browse");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    commodity: "",
    pricePerUnit: "",
    unit: "kg",
    targetQuantity: "",
    deadline: "",
    location: "",
    description: "",
  });

  const [joining, setJoining] = useState<{ pool: Pool | null; qty: string }>({
    pool: null,
    qty: "",
  });

  // ─── FETCH ────────────────────────────────────────────────────────────────
  // Fetches ALL open pools. Farmer browse tab filters to buyer-created ones.
  // Farmer "mine" tab filters to their own created pools.
  const fetchPools = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pools?status=open");
      const data = await res.json();
      setPools(data.pools || []);
    } catch (err) {
      console.error("Failed to fetch pools", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authReady && (tab === "browse" || tab === "mine")) fetchPools();
  }, [tab, authReady]);

  // ─── CREATE ───────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.commodity || !form.pricePerUnit || !form.targetQuantity) {
      alert("Please fill in commodity, price, and target quantity.");
      return;
    }
    const res = await fetch("/api/pools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        pricePerUnit: Number(form.pricePerUnit),
        targetQuantity: Number(form.targetQuantity),
        creatorId: farmer.id,
        creatorName: farmer.name,
        creatorRole: "farmer",
      }),
    });
    if (res.ok) {
      alert("Pool created!");
      setTab("mine");
      setForm({
        commodity: "",
        pricePerUnit: "",
        unit: "kg",
        targetQuantity: "",
        deadline: "",
        location: "",
        description: "",
      });
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  // ─── JOIN ─────────────────────────────────────────────────────────────────
  const handleJoin = async () => {
    if (!joining.pool || !joining.qty) return;
    const res = await fetch(`/api/pools/${joining.pool.id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        farmerId: farmer.id,
        farmerName: farmer.name,
        quantity: Number(joining.qty),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      alert(`Joined! Pool is now ${data.newStatus}.`);
      setJoining({ pool: null, qty: "" });
      fetchPools();
    } else {
      alert(data.error);
    }
  };

  // ─── DERIVED LISTS ────────────────────────────────────────────────────────
  // Buyer requests: pools created by buyers — shown in farmer's browse tab
  const buyerRequestPools = pools.filter((p) => p.creatorRole === "buyer");
  // Farmer's own pools: pools this farmer created
  const myPools = pools.filter((p) => p.creatorId === farmer.id);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["browse", "mine", "create"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
              tab === t
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {t === "browse"
              ? "Buyer Requests"
              : t === "mine"
                ? "My Pools"
                : "Create Pool"}
          </button>
        ))}
      </div>

      {/* ── BROWSE: buyer-created pools for farmers to join ── */}
      {tab === "browse" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Buyers looking for farmers — join a pool to sell your produce.
          </p>
          {loading ? (
            <p>Loading...</p>
          ) : buyerRequestPools.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No open buyer requests right now.
            </p>
          ) : (
            buyerRequestPools.map((pool) => (
              <div
                key={pool.id}
                className="border rounded-xl p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 capitalize">
                      {pool.commodity}
                    </h3>
                    <p className="text-sm text-gray-500">
                      by {pool.creatorName}
                    </p>
                  </div>
                  <span className="text-green-600 font-bold">
                    ₹{pool.pricePerUnit}/{pool.unit}
                  </span>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    Needs: {pool.targetQuantity} {pool.unit}
                  </p>
                  <p>
                    Filled: {pool.filledQuantity} {pool.unit} (
                    {Math.round(
                      ((pool.filledQuantity || 0) /
                        (pool.targetQuantity || 1)) *
                        100,
                    )}
                    %)
                  </p>
                  {pool.location && <p>📍 {pool.location}</p>}
                  {pool.deadline && (
                    <p>
                      ⏰ By{" "}
                      {new Date(pool.deadline).toLocaleDateString("en-IN")}
                    </p>
                  )}
                  {pool.description && (
                    <p className="text-gray-400 text-xs mt-1">
                      {pool.description}
                    </p>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-2 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        ((pool.filledQuantity || 0) /
                          (pool.targetQuantity || 1)) *
                          100,
                        100,
                      )}%`,
                    }}
                  />
                </div>

                <button
                  onClick={() => setJoining({ pool, qty: "" })}
                  className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium"
                >
                  Add My Quantity
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── MINE: farmer's own created pools ── */}
      {tab === "mine" && (
        <div className="space-y-3">
          {loading ? (
            <p>Loading...</p>
          ) : myPools.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              You haven't created any pools yet.
            </p>
          ) : (
            myPools.map((pool) => (
              <div
                key={pool.id}
                className="border rounded-xl p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold capitalize">{pool.commodity}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      pool.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {pool.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  ₹{pool.pricePerUnit}/{pool.unit} · {pool.filledQuantity}/
                  {pool.targetQuantity} {pool.unit} filled
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {pool.members?.length || 0} member(s) joined
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── CREATE: farmer creates their own pool ── */}
      {tab === "create" && (
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <h2 className="font-semibold text-gray-800">Create a Selling Pool</h2>
          <p className="text-xs text-gray-500">
            Create a pool and invite other farmers to collectively sell.
          </p>

          <input
            className="w-full border rounded-lg p-2 text-sm"
            placeholder="Commodity (e.g. Wheat, Rice)"
            value={form.commodity}
            onChange={(e) => setForm({ ...form, commodity: e.target.value })}
          />

          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg p-2 text-sm"
              placeholder="Price per unit (₹)"
              type="number"
              value={form.pricePerUnit}
              onChange={(e) =>
                setForm({ ...form, pricePerUnit: e.target.value })
              }
            />
            <select
              className="border rounded-lg p-2 text-sm"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            >
              <option value="kg">kg</option>
              <option value="quintal">quintal</option>
              <option value="ton">ton</option>
            </select>
          </div>

          <input
            className="w-full border rounded-lg p-2 text-sm"
            placeholder="Target total quantity"
            type="number"
            value={form.targetQuantity}
            onChange={(e) =>
              setForm({ ...form, targetQuantity: e.target.value })
            }
          />
          <input
            className="w-full border rounded-lg p-2 text-sm"
            placeholder="Location (optional)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            className="w-full border rounded-lg p-2 text-sm"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
          <textarea
            className="w-full border rounded-lg p-2 text-sm"
            placeholder="Description (optional)"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button
            onClick={handleCreate}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-medium"
          >
            Create Pool
          </button>
        </div>
      )}

      {/* ── JOIN MODAL ── */}
      {joining.pool && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl p-6 w-full max-w-md">
            <h3 className="font-semibold mb-1">
              Join Pool: {joining.pool.commodity}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              How many {joining.pool.unit} do you want to contribute?
            </p>
            <input
              className="w-full border rounded-lg p-2 text-sm mb-4"
              type="number"
              placeholder={`Quantity in ${joining.pool.unit}`}
              value={joining.qty}
              onChange={(e) => setJoining({ ...joining, qty: e.target.value })}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setJoining({ pool: null, qty: "" })}
                className="flex-1 border rounded-lg py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
