import { useState, useCallback, useRef } from 'react';
import { getRoute, RouteResult } from '../services/routingService';
import { findNearestLocation } from '../utils/geoUtils';
import { ApiEvacuationCenter } from '../services/api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RoutingDestination {
    name: string;
    coordinate: [number, number]; // [lng, lat]
}

export interface RoutingState {
    /** GeoJSON Feature wrapping the OSRM route LineString */
    routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> | null;
    /** Currently routed destination */
    destination: RoutingDestination | null;
    /** Total route distance in metres */
    distance: number | null;
    /** Estimated travel time in seconds */
    duration: number | null;
    isLoading: boolean;
    error: string | null;
}

const INITIAL_STATE: RoutingState = {
    routeGeoJSON: null,
    destination: null,
    distance: null,
    duration: null,
    isLoading: false,
    error: null,
};

/** Minimum user-move distance (metres) before triggering an automatic reroute */
const REROUTE_THRESHOLD = 50;

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Manages route state between the user's current position and a destination.
 *
 * Provides:
 * - `routeTo(start, end, name)` — route to a specific coordinate
 * - `routeToNearest(userCoord, centers)` — route to nearest evacuation center
 * - `clearRoute()` — dismiss the active route
 * - `shouldReroute(currentStart)` — check if user has moved enough to reroute
 */
export function useRouting() {
    const [state, setState] = useState<RoutingState>(INITIAL_STATE);
    const lastStartRef = useRef<[number, number] | null>(null);

    /** Wrap a raw LineString geometry in a GeoJSON Feature for ShapeSource */
    const toFeature = (
        geometry: GeoJSON.LineString,
    ): GeoJSON.Feature<GeoJSON.LineString> => ({
        type: 'Feature',
        properties: {},
        geometry,
    });

    // ── Route to a specific destination ──────────────────────────────────
    const routeTo = useCallback(
        async (
            start: [number, number],
            end: [number, number],
            destinationName: string,
        ) => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));
            try {
                const result: RouteResult = await getRoute(start, end);
                lastStartRef.current = start;
                setState({
                    routeGeoJSON: toFeature(result.geometry),
                    destination: { name: destinationName, coordinate: end },
                    distance: result.distance,
                    duration: result.duration,
                    isLoading: false,
                    error: null,
                });
            } catch (e: any) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: e.message || 'Failed to calculate route.',
                }));
            }
        },
        [],
    );

    // ── Route to the nearest evacuation center ───────────────────────────
    const routeToNearest = useCallback(
        async (
            userCoord: [number, number],
            centers: ApiEvacuationCenter[],
        ) => {
            const nearest = findNearestLocation(
                userCoord,
                centers,
                (c) => [c.location_longitude, c.location_latitude],
            );
            if (!nearest) {
                setState((prev) => ({
                    ...prev,
                    error: 'No evacuation centers available.',
                }));
                return;
            }
            const dest: [number, number] = [
                nearest.location.location_longitude,
                nearest.location.location_latitude,
            ];
            await routeTo(userCoord, dest, nearest.location.facility);
        },
        [routeTo],
    );

    // ── Clear the active route ───────────────────────────────────────────
    const clearRoute = useCallback(() => {
        setState(INITIAL_STATE);
        lastStartRef.current = null;
    }, []);

    // ── Check if user has moved enough to justify a reroute ──────────────
    const shouldReroute = useCallback(
        (currentStart: [number, number]): boolean => {
            if (!lastStartRef.current || !state.destination) return false;
            const [lng1, lat1] = lastStartRef.current;
            const [lng2, lat2] = currentStart;
            // Quick Euclidean approximation (accurate enough for <1 km checks)
            const dLat = (lat2 - lat1) * 111_320;
            const dLng = (lng2 - lng1) * 111_320 * Math.cos((lat1 * Math.PI) / 180);
            return Math.sqrt(dLat * dLat + dLng * dLng) > REROUTE_THRESHOLD;
        },
        [state.destination],
    );

    return {
        ...state,
        routeTo,
        routeToNearest,
        clearRoute,
        shouldReroute,
    };
}
