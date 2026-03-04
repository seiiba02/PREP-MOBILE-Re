/**
 * Utility functions for geographic calculations.
 */

/**
 * Calculates the Haversine distance between two coordinates in meters.
 * @param coord1 [longitude, latitude]
 * @param coord2 [longitude, latitude]
 * @returns Distance in meters
 */
export function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Finds the nearest location from an array of locations.
 * @param userCoord [longitude, latitude]
 * @param locations Array of locations
 * @param getCoord Function to extract [longitude, latitude] from a location
 * @returns The nearest location and the distance in meters
 */
export function findNearestLocation<T>(
    userCoord: [number, number],
    locations: T[],
    getCoord: (loc: T) => [number, number]
): { location: T; distance: number } | null {
    if (!locations || locations.length === 0) return null;

    let nearestLocation = locations[0];
    let minDistance = calculateDistance(userCoord, getCoord(nearestLocation));

    for (let i = 1; i < locations.length; i++) {
        const location = locations[i];
        const distance = calculateDistance(userCoord, getCoord(location));

        if (distance < minDistance) {
            minDistance = distance;
            nearestLocation = location;
        }
    }

    return { location: nearestLocation, distance: minDistance };
}

/**
 * Formats distance in meters to a readable string (e.g., "500 m", "1.2 km").
 */
export function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Formats duration in seconds to a readable string (e.g., "5 mins", "1 hr 10 mins").
 */
export function formatDuration(seconds: number): string {
    const minutes = Math.ceil(seconds / 60);
    if (minutes < 60) {
        return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr${hours !== 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} min` : ''}`;
}
