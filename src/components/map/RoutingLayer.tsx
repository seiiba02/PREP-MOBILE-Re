import React, { memo } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';

interface RoutingLayerProps {
    /** GeoJSON Feature containing the route LineString from OSRM */
    routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString>;
}

/**
 * Renders the driving route as a styled polyline on the MapLibre map.
 *
 * Uses two LineLayer children for a casing + stroke effect:
 * - Outer casing: darker blue, wider, semi-transparent  → depth
 * - Inner stroke: bright blue, narrower                 → primary line
 *
 * Memoized so it only re-renders when the GeoJSON reference changes.
 */
export const RoutingLayer = memo(function RoutingLayer({
    routeGeoJSON,
}: RoutingLayerProps) {
    return (
        <MapLibreGL.ShapeSource id="route-source" shape={routeGeoJSON}>
            {/* Shadow / casing line */}
            <MapLibreGL.LineLayer
                id="route-casing"
                style={{
                    lineColor: '#1E40AF',
                    lineWidth: 8,
                    lineOpacity: 0.4,
                    lineCap: 'round',
                    lineJoin: 'round',
                }}
            />
            {/* Primary route line */}
            <MapLibreGL.LineLayer
                id="route-line"
                style={{
                    lineColor: '#3B82F6', // colors.info
                    lineWidth: 5,
                    lineOpacity: 0.9,
                    lineCap: 'round',
                    lineJoin: 'round',
                }}
            />
        </MapLibreGL.ShapeSource>
    );
});
