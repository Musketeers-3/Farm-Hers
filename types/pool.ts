// types/pool.ts
export type PoolStatus = "open" | "filled" | "closed" | "cancelled";
export type PoolCreatorRole = "buyer" | "farmer";

export interface PoolMember {
  farmerId: string;
  farmerName: string;
  quantity: number; // in kg or units
  joinedAt: string; // ISO date
}

export interface Pool {
  id: string;
  creatorId: string;
  creatorRole: PoolCreatorRole; // who created it
  creatorName: string;

  commodity: string;
  pricePerUnit: number;
  unit: string; // "kg", "quintal", etc.

  // For buyer-created pools: buyer sets the total they want
  requestedQuantity?: number;

  // For farmer-created pools: farmers collectively fill this
  targetQuantity: number;
  filledQuantity: number; // sum of all members' quantities

  members: PoolMember[]; // farmers who joined

  status: PoolStatus;
  deadline?: string; // ISO date
  location?: string;
  description?: string;

  createdAt: string;
  updatedAt: string;
}