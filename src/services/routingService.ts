import { extractApiError } from './api';

export interface RouteResult {
    geometry: GeoJSON.LineString;
    distance: number; // in meters
    duration: number; // in seconds
}

/**
 * Fetches a driving route between two points using the public OSRM API.
 * @param start [longitude, latitude]
 * @param end [longitude, latitude]
 * @returns A promise resolving to the route geometry, total distance, and duration.
 */
export const getRoute = async (
    start: [number, number],
    end: [number, number]
): Promise<RouteResult> => {
    try {
        // Format: longitude,latitude;longitude,latitude
        const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
        const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

        // Timeout manually if standard fetch abort isn't supported universally
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Routing service returned status ${response.status}`);
        }

        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            throw new Error('No valid route could be found between these locations.');
        }

        const bestRoute = data.routes[0];
        return {
            geometry: bestRoute.geometry,
            distance: bestRoute.distance,
            duration: bestRoute.duration,
        };
    } catch (error: any) {
        if (error.name === 'AbortError' || error.message.includes('Network')) {
            throw new Error('Network failure. Please check your internet connection.');
        }
        throw new Error(extractApiError(error) || 'Failed to fetch route.');
    }
};
