// lib/routing.ts

export interface RoadDistanceResult {
  drivingDistanceKm: number;
  durationMinutes: number;
}

/**
 * Fetches actual road distance using the free OSRM public API.
 * Note: OSRM expects coordinates in Longitude,Latitude order.
 */
export async function getActualDrivingDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): Promise<RoadDistanceResult | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      return null;
    }

    return {
      drivingDistanceKm: data.routes[0].distance / 1000,
      durationMinutes: data.routes[0].duration / 60,
    };
  } catch (error) {
    console.error("Routing API failed:", error);
    return null;
  }
}
