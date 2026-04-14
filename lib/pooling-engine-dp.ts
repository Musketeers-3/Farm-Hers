// lib/pooling-engine-dp.ts
import { calculateDistance } from "./geo";
import { getActualDrivingDistance } from "./routing";

export interface CropListing {
  id: string;
  farmerId: string;
  cropType: string;
  qualityGrade: string;
  volumeQuintals: number;
  lat: number;
  lng: number;
  drivingDistanceKm?: number; // Injected during Phase 2
}

export interface PoolResult {
  poolId: string;
  targetVolume: number;
  actualVolume: number;
  participants: CropListing[];
  unpooledListings: CropListing[];
}

export async function generateMicroPoolDP(
  anchorLat: number,
  anchorLng: number,
  availableListings: CropListing[],
  targetVolume: number = 50,
  maxRadiusKm: number = 20,
  requiredCrop: string = "wheat",
  requiredQuality: string = "Grade A",
): Promise<PoolResult | null> {
  // ==========================================
  // PHASE 1: Heuristic Filter (Haversine)
  // ==========================================
  // Instantly scan thousands of records locally. We cast a 1.5x wider
  // net (e.g., 30km) to account for road curves before hitting the Map API.
  const candidateNeighbors = availableListings.filter((listing) => {
    if (listing.cropType.toLowerCase() !== requiredCrop.toLowerCase())
      return false;
    if (listing.qualityGrade !== requiredQuality) return false;

    const straightLine = calculateDistance(
      anchorLat,
      anchorLng,
      listing.lat,
      listing.lng,
    );
    return straightLine <= maxRadiusKm * 1.5;
  });

  // ==========================================
  // PHASE 2: Map API Verification (OSRM)
  // ==========================================
  const validNeighbors: CropListing[] = [];

  // Process the small subset of survivors concurrently for speed
  await Promise.all(
    candidateNeighbors.map(async (listing) => {
      const roadData = await getActualDrivingDistance(
        anchorLat,
        anchorLng,
        listing.lat,
        listing.lng,
      );

      if (roadData && roadData.drivingDistanceKm <= maxRadiusKm) {
        validNeighbors.push({
          ...listing,
          drivingDistanceKm: roadData.drivingDistanceKm,
        });
      }
    }),
  );

  const totalAvailable = validNeighbors.reduce(
    (sum, l) => sum + l.volumeQuintals,
    0,
  );
  if (totalAvailable < targetVolume) {
    return null; // Not enough volume in the valid driving radius
  }

  // ==========================================
  // PHASE 3: 0/1 Knapsack DP Matrix
  // ==========================================
  const dp: (CropListing[] | null)[] = new Array(totalAvailable + 1).fill(null);
  dp[0] = [];

  for (const listing of validNeighbors) {
    const vol = Math.floor(listing.volumeQuintals);

    // Traverse backwards to ensure each farmer's listing is only used once
    for (let v = totalAvailable; v >= vol; v--) {
      if (dp[v - vol] !== null && dp[v] === null) {
        dp[v] = [...dp[v - vol]!, listing];
      }
    }
  }

  // ==========================================
  // PHASE 4: Extract Optimal Subset
  // ==========================================
  let bestVolume = -1;
  // Look for the exact target first, then incrementally search upwards
  // for the closest possible match to prevent fractional splitting
  for (let v = targetVolume; v <= totalAvailable; v++) {
    if (dp[v] !== null) {
      bestVolume = v;
      break;
    }
  }

  if (bestVolume === -1) return null;

  const pooledParticipants = dp[bestVolume]!;

  // Identify the listings that were kept whole for the next pool
  const pooledIds = new Set(pooledParticipants.map((p) => p.id));
  const unpooledListings = validNeighbors.filter((l) => !pooledIds.has(l.id));

  return {
    poolId: `pool-dp-${Date.now()}`,
    targetVolume,
    actualVolume: bestVolume,
    participants: pooledParticipants,
    unpooledListings,
  };
}
