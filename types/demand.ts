export type DemandStatus = "open" | "filled" | "contracted" | "expired";

export interface DemandMember {
  farmerId: string;
  quantity: number;
  joinedAt: string;
}

export interface Demand {
  id: string;
  cropId: string;
  targetQuantity: number;
  filledQuantity: number;
  pricePerQuintal: number;
  bonusPerQuintal: number;
  deadline: string;
  status: DemandStatus;
  buyerId: string;
  createdAt: string;
  members: DemandMember[];
  contributors: number;
}

export interface CreateDemandBody {
  cropId: string;
  targetQuantity: number;
  pricePerQuintal: number;
  bonusPerQuintal?: number;
  deadline: string;
  buyerId: string;
}

export interface JoinDemandBody {
  farmerId: string;
  quantity: number;
}