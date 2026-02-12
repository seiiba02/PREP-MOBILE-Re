/**
 * Map utility functions for processing San Juan City GeoJSON data.
 * 
 * The MAP_OUTLINE constant is a GeoJSON FeatureCollection containing:
 * - 21 Polygon features (barangay boundary outlines)
 * - 21 Point features (barangay label centroids)
 * 
 * These utilities filter and transform the data for MapLibre rendering.
 */

import { MAP_OUTLINE } from '../constants/mapOutline';
import { SANJUAN_RIVER } from '../constants/waterways/sanjuan';
import { ERMITANO_CREEK } from '../constants/waterways/ermitano';
import { MAYTUNAS_CREEK } from '../constants/waterways/maytunas';

// ─── Types ───────────────────────────────────────────────────────────────────

type GeoJSONFeature = (typeof MAP_OUTLINE)['features'][number];

interface BoundingBox {
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
}

// Future: Barangay selection state
// interface BarangayMapState {
//     selectedBarangay: string | null;
//     highlightedBarangays: string[];
//     visibleLayers: ('outline' | 'fill' | 'labels')[];
// }

// Future: Per-barangay data overlay
// interface BarangayOverlayData {
//     barangayName: string;
//     incidentCount?: number;
//     populationDensity?: number;
//     riskLevel?: 'low' | 'medium' | 'high' | 'critical';
// }

// ─── Feature Filters ─────────────────────────────────────────────────────────

/**
 * Returns only Polygon features (barangay boundaries) from the GeoJSON data.
 */
export function getBarangayPolygons(): GeoJSONFeature[] {
    return MAP_OUTLINE.features.filter(
        (f) => f.geometry.type === 'Polygon'
    );
}

/**
 * Returns only Point features (barangay label centroids) from the GeoJSON data.
 */
export function getBarangayCentroids(): GeoJSONFeature[] {
    return MAP_OUTLINE.features.filter(
        (f) => f.geometry.type === 'Point'
    );
}

// ─── GeoJSON Constructors ────────────────────────────────────────────────────

/**
 * Returns a GeoJSON FeatureCollection containing only the barangay polygons.
 * Used as the ShapeSource for rendering the city outline on MapLibre.
 */
export function getCityOutlineGeoJSON() {
    return {
        type: 'FeatureCollection' as const,
        features: getBarangayPolygons(),
    };
}

/**
 * Returns a GeoJSON FeatureCollection containing only barangay centroids.
 * Used for rendering barangay name labels on the map.
 */
export function getBarangayCentroidsGeoJSON() {
    return {
        type: 'FeatureCollection' as const,
        features: getBarangayCentroids(),
    };
}

/**
 * Returns a GeoJSON FeatureCollection containing the city's main waterways.
 * Combines San Juan River, Ermitaño Creek, and Maytunas Creek.
 */
export function getWaterwaysGeoJSON() {
    return {
        type: 'FeatureCollection' as const,
        features: [
            {
                type: 'Feature' as const,
                properties: { name: 'San Juan River' },
                geometry: SANJUAN_RIVER,
            },
            {
                type: 'Feature' as const,
                properties: { name: 'Ermitaño Creek' },
                geometry: ERMITANO_CREEK,
            },
            {
                type: 'Feature' as const,
                properties: { name: 'Maytunas Creek' },
                geometry: MAYTUNAS_CREEK,
            },
        ],
    };
}

// ─── Bounding Box ────────────────────────────────────────────────────────────

/**
 * Computes the bounding box that encloses all barangay polygons.
 * Used for camera fitting to show the entire city on load.
 */
export function getCityBounds(): BoundingBox {
    const polygons = getBarangayPolygons();
    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;

    for (const feature of polygons) {
        if (feature.geometry.type === 'Polygon') {
            const coords = feature.geometry.coordinates as number[][][];
            for (const ring of coords) {
                for (const coord of ring) {
                    const lng = coord[0];
                    const lat = coord[1];
                    if (lng < minLng) minLng = lng;
                    if (lat < minLat) minLat = lat;
                    if (lng > maxLng) maxLng = lng;
                    if (lat > maxLat) maxLat = lat;
                }
            }
        }
    }

    return { minLng, minLat, maxLng, maxLat };
}

/**
 * Returns the bounding box as a MapLibre-compatible bounds array.
 * Format: [[sw_lng, sw_lat], [ne_lng, ne_lat]]
 */
export function getCityBoundsArray(): [[number, number], [number, number]] {
    const { minLng, minLat, maxLng, maxLat } = getCityBounds();
    return [[minLng, minLat], [maxLng, maxLat]];
}

// ─── Future: Barangay Selection ──────────────────────────────────────────────

/**
 * Find a specific barangay polygon by name.
 * 
 * Future use: When a user taps a barangay on the map, the feature name
 * from the tap event is used to look up the full polygon for highlighting.
 */
export function getBarangayByName(name: string): GeoJSONFeature | undefined {
    return getBarangayPolygons().find(
        (f) => f.properties?.name === name
    );
}

/**
 * Returns a single barangay as a GeoJSON FeatureCollection.
 * 
 * Future use: Pass to a dedicated highlight ShapeSource to render
 * the selected barangay with distinct fill/stroke styling.
 */
export function getBarangayGeoJSON(name: string) {
    const feature = getBarangayByName(name);
    return {
        type: 'FeatureCollection' as const,
        features: feature ? [feature] : [],
    };
}

/**
 * Get the list of all barangay names from the polygon features.
 */
export function getBarangayNames(): string[] {
    return getBarangayPolygons()
        .map((f) => f.properties?.name)
        .filter((name): name is string => typeof name === 'string')
        .sort();
}
