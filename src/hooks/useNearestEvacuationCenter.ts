import { useState, useEffect } from 'react';
import { getEvacuationCenters, ApiEvacuationCenter } from '../services/api';
import { findNearestLocation, formatDistance } from '../utils/geoUtils';
import { useUserLocation } from '../contexts/LocationContext';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NearestEvacuationCenterState {
    /** The nearest available evacuation center, or null while loading / unavailable */
    center: ApiEvacuationCenter | null;
    /** Haversine distance in metres to `center` */
    distanceMeters: number | null;
    /** Human-friendly distance string, e.g. "250 m" or "1.4 km" */
    distanceLabel: string | null;
    isLoading: boolean;
    /** 'location' = GPS unavailable, 'fetch' = API error, null = no error */
    error: 'location' | 'fetch' | null;
}

const INITIAL: NearestEvacuationCenterState = {
    center: null,
    distanceMeters: null,
    distanceLabel: null,
    isLoading: true,
    error: null,
};

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Returns the nearest available evacuation center to the user's current GPS
 * position along with the straight-line distance.
 *
 * - Combines `useLocation` (expo-location, Expo-Go-safe) with the
 *   `getEvacuationCenters` API call.
 * - Returns loading state while either the GPS fix or the API response is pending.
 * - Gracefully returns `error: 'location'` when GPS is unavailable (Expo Go /
 *   permission denied) so the UI can show an appropriate placeholder.
 */
export function useNearestEvacuationCenter(): NearestEvacuationCenterState {
    const { userCoords, isLocating } = useUserLocation();
    const [centers, setCenters] = useState<ApiEvacuationCenter[] | null>(null);
    const [fetchError, setFetchError] = useState(false);

    // ── Fetch evacuation centers once on mount ────────────────────────────
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getEvacuationCenters();
                if (!cancelled) {
                    // Filter to only available / active centers
                    const active = data.filter(
                        (c) => c.available && c.status !== 'inactive',
                    );
                    setCenters(active.length > 0 ? active : data);
                }
            } catch {
                if (!cancelled) setFetchError(true);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // ── Derive nearest center whenever coords or centers arrive ───────────
    if (fetchError) {
        return {
            center: null,
            distanceMeters: null,
            distanceLabel: null,
            isLoading: false,
            error: 'fetch',
        };
    }

    // Still waiting on centers list or GPS first fix
    if (centers === null || isLocating) {
        return { ...INITIAL, isLoading: true };
    }

    // GPS not yet available (map not opened yet)
    if (!userCoords) {
        return {
            center: null,
            distanceMeters: null,
            distanceLabel: null,
            isLoading: false,
            error: 'location',
        };
    }

    // Find nearest
    const result = findNearestLocation(
        userCoords,
        centers,
        (c) => [c.location_longitude, c.location_latitude],
    );

    if (!result) {
        return {
            center: null,
            distanceMeters: null,
            distanceLabel: null,
            isLoading: false,
            error: 'fetch',
        };
    }

    return {
        center: result.location,
        distanceMeters: result.distance,
        distanceLabel: formatDistance(result.distance),
        isLoading: false,
        error: null,
    };
}
