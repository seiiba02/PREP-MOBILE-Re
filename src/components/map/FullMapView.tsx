import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants/colors';
import { config } from '../../constants/config';
import { getCityOutlineGeoJSON, getWaterwaysGeoJSON, getBarangayGeoJSON, getBarangayBoundsArray } from '../../utils/mapUtils';
import { useAuth } from '../../contexts/AuthContext';
import { getEvacuationCenters, ApiEvacuationCenter } from '../../services/api';
import { useRouting } from '../../hooks/useRouting';
import { useUserLocation } from '../../contexts/LocationContext';
import { RoutingLayer } from './RoutingLayer';
import { RoutingInfoCard } from './RoutingInfoCard';


const markerIcon = (type: string) => {
    switch (type) {
        case 'hospital':
            return 'hospital-marker';
        case 'evacuation':
            return 'home-alert';
        case 'fire_station':
            return 'fire-truck';
        default:
            return 'office-building';
    }
};

const markerColor = (type: string) => {
    switch (type) {
        case 'hospital': return colors.info;
        case 'evacuation': return colors.success;
        case 'fire_station': return colors.critical;
        default: return colors.secondary;
    }
};

export function FullMapView() {
    const mapRef = useRef<MapLibreGL.MapViewRef>(null);
    const cameraRef = useRef<MapLibreGL.CameraRef>(null);
    const [mapStyle, setMapStyle] = useState<'liberty' | 'positron'>('liberty');
    const [isSingleBarangayView, setIsSingleBarangayView] = useState(false);
    const [showEvacuationCenters, setShowEvacuationCenters] = useState(false);
    const [evacuationCenters, setEvacuationCenters] = useState<ApiEvacuationCenter[]>([]);
    const { user } = useAuth();

    // ── GPS coordinates from MapLibre’s own UserLocation session ──────────────
    const userCoordsRef = useRef<[number, number] | null>(null);
    const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { updateCoords } = useUserLocation();
    const handleLocationUpdate = useCallback((loc: MapLibreGL.Location) => {
        const coords: [number, number] = [loc.coords.longitude, loc.coords.latitude];
        userCoordsRef.current = coords;
        setUserCoords(coords);
        updateCoords(coords);
    }, [updateCoords]);

    // ── Routing ───────────────────────────────────────────────────────────────
    const {
        routeGeoJSON,
        destination: routeDestination,
        distance: routeDistance,
        duration: routeDuration,
        isLoading: routeLoading,
        error: routeError,
        routeTo,
        routeToNearest,
        clearRoute,
    } = useRouting();

    const handleMarkerPress = useCallback(
        (center: ApiEvacuationCenter) => {
            const coords = userCoordsRef.current;
            if (!coords) {
                Alert.alert(
                    'Location Unavailable',
                    'Your position has not been determined yet. Make sure GPS is enabled and wait a moment.',
                );
                return;
            }
            routeTo(
                coords,
                [center.location_longitude, center.location_latitude],
                center.facility,
            );
        },
        [routeTo],
    );

    /** “Route to Nearest” button handler */
    const handleRouteToNearest = useCallback(() => {
        const coords = userCoordsRef.current;
        if (!coords) {
            Alert.alert(
                'Location Unavailable',
                'Your position has not been determined yet. Make sure GPS is enabled and wait a moment.',
            );
            return;
        }
        if (evacuationCenters.length === 0) {
            Alert.alert('No Data', 'Evacuation centers have not loaded yet.');
            return;
        }
        routeToNearest(coords, evacuationCenters);
    }, [routeToNearest, evacuationCenters]);

    /**
     * Refreshes the routing origin using the most recent GPS fix already
     * provided by MapLibre's UserLocation stream — no extra native module needed.
     * If a route is active, re-routes from the fresh position.
     * Also flies the camera to the user's current location.
     */
    const handleRefreshLocation = useCallback(async () => {
        const coords = userCoordsRef.current;
        if (!coords) {
            Alert.alert(
                'Location Unavailable',
                'Your position has not been determined yet. Make sure GPS is enabled and wait a moment.',
            );
            return;
        }
        setIsRefreshing(true);
        try {
            // Fly camera to current position with a close zoom level
            cameraRef.current?.setCamera({
                centerCoordinate: coords,
                zoomLevel: 16,
                animationDuration: 600,
                animationMode: 'flyTo',
            });
            // Re-route from the fresh position if a route is already active
            if (routeDestination) {
                await routeTo(coords, routeDestination.coordinate, routeDestination.name);
            }
        } finally {
            setIsRefreshing(false);
        }
    }, [routeDestination, routeTo]);

    /** Camera bounds that fit the user + destination when a route is active */

    const routeBounds = useMemo(() => {
        if (!routeGeoJSON || !userCoords || !routeDestination) {
            return null;
        }
        const [uLng, uLat] = userCoords;
        const [dLng, dLat] = routeDestination.coordinate;
        return {
            sw: [Math.min(uLng, dLng), Math.min(uLat, dLat)] as [number, number],
            ne: [Math.max(uLng, dLng), Math.max(uLat, dLat)] as [number, number],
        };
    }, [routeGeoJSON, userCoords, routeDestination]);

    useEffect(() => {
        if (showEvacuationCenters && evacuationCenters.length === 0) {
            getEvacuationCenters()
                .then(setEvacuationCenters)
                .catch((e) => console.error("Failed to load evacuation centers:", e));
        }
    }, [showEvacuationCenters, evacuationCenters.length]);

    const displayOutline = useMemo(() => {
        if (isSingleBarangayView && user?.barangay) {
            const barangayData = getBarangayGeoJSON(user.barangay);
            if (barangayData.features.length > 0) {
                return barangayData;
            }
        }
        return getCityOutlineGeoJSON();
    }, [isSingleBarangayView, user?.barangay]);

    const currentBounds = useMemo(() => {
        if (isSingleBarangayView && user?.barangay) {
            return getBarangayBoundsArray(user.barangay);
        }
        return null;
    }, [isSingleBarangayView, user?.barangay]);

    const waterways = useMemo(() => getWaterwaysGeoJSON(), []);

    const toggleMapStyle = () =>
        setMapStyle((prev) => (prev === 'liberty' ? 'positron' : 'liberty'));

    const styleUrl =
        mapStyle === 'liberty'
            ? config.maplibre.styleUrl
            : 'https://tiles.openfreemap.org/styles/positron';

    return (
        <>
            <MapLibreGL.MapView
                ref={mapRef}
                style={styles.map}
                mapStyle={styleUrl}
                logoEnabled={false}
                attributionEnabled={false}
            >
                <MapLibreGL.Camera
                    ref={cameraRef}
                    bounds={
                        routeBounds
                            ? {
                                sw: routeBounds.sw,
                                ne: routeBounds.ne,
                                paddingTop: 120,
                                paddingBottom: 200,
                                paddingLeft: 60,
                                paddingRight: 60,
                            }
                            : currentBounds
                                ? {
                                    sw: currentBounds[0],
                                    ne: currentBounds[1],
                                    paddingTop: 50,
                                    paddingBottom: 50,
                                    paddingLeft: 50,
                                    paddingRight: 50,
                                }
                                : undefined
                    }
                    centerCoordinate={!routeBounds && !currentBounds ? config.maplibre.center : undefined}
                    zoomLevel={!routeBounds && !currentBounds ? config.maplibre.zoom : undefined}
                    animationDuration={800}
                />

                {/* San Juan City Outline (or User's Barangay) */}
                <MapLibreGL.ShapeSource
                    id="city-outline-source"
                    shape={displayOutline as any}
                >
                    <MapLibreGL.FillLayer
                        id="city-outline-fill"
                        style={{
                            fillColor: 'rgba(27, 37, 96, 0.08)',
                            fillOutlineColor: colors.secondary,
                        }}
                    />
                    <MapLibreGL.LineLayer
                        id="city-outline-line"
                        style={{
                            lineColor: colors.secondary,
                            lineWidth: 2,
                            lineOpacity: 0.8,
                        }}
                    />
                </MapLibreGL.ShapeSource>

                {/* Waterways Section — Blue lines for rivers/creeks */}
                <MapLibreGL.ShapeSource
                    id="waterways-source"
                    shape={waterways as any}
                >
                    <MapLibreGL.LineLayer
                        id="waterways-line"
                        style={{
                            lineColor: '#0EA5E9',
                            lineWidth: 5,
                            lineOpacity: 1,
                            lineCap: 'round',
                            lineJoin: 'round',
                        }}
                    />
                </MapLibreGL.ShapeSource>

                <MapLibreGL.UserLocation
                    visible={true}
                    onUpdate={handleLocationUpdate}
                />

                {/* Route line (rendered above base layers, below markers) */}
                {routeGeoJSON && (
                    <RoutingLayer routeGeoJSON={routeGeoJSON} />
                )}

                {/* Evacuation Centers Markers — tappable for routing */}
                {showEvacuationCenters && evacuationCenters.map((center) => (
                    <MapLibreGL.PointAnnotation
                        key={center.id}
                        id={`evac-${center.id}`}
                        coordinate={[center.location_longitude, center.location_latitude]}
                        onSelected={() => handleMarkerPress(center)}
                    >
                        <View style={[styles.markerContainer, { backgroundColor: markerColor('evacuation') }]}>
                            <MaterialCommunityIcons name={markerIcon('evacuation') as any} size={16} color="white" />
                        </View>
                    </MapLibreGL.PointAnnotation>
                ))}
            </MapLibreGL.MapView>

            {/* Floating Controls */}
            <SafeAreaView style={styles.controls}>
                <View style={styles.topControls}>
                    {user?.barangay && (
                        <TouchableOpacity
                            style={[
                                styles.controlButton,
                                isSingleBarangayView && { backgroundColor: colors.secondary }
                            ]}
                            onPress={() => setIsSingleBarangayView(!isSingleBarangayView)}
                        >
                            <MaterialCommunityIcons
                                name={isSingleBarangayView ? 'map-marker-radius' : 'map-marker-radius-outline'}
                                size={24}
                                color={isSingleBarangayView ? 'white' : colors.secondary}
                            />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[
                            styles.controlButton,
                            { marginTop: 10 },
                            showEvacuationCenters && { backgroundColor: colors.success }
                        ]}
                        onPress={() => {
                            if (showEvacuationCenters) {
                                clearRoute();
                            }
                            setShowEvacuationCenters(!showEvacuationCenters);
                        }}
                    >
                        <MaterialCommunityIcons
                            name={showEvacuationCenters ? 'home-alert' : 'home-alert-outline'}
                            size={24}
                            color={showEvacuationCenters ? 'white' : colors.secondary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.controlButton, { marginTop: 10 }]}
                        onPress={toggleMapStyle}
                    >
                        <MaterialCommunityIcons
                            name={
                                mapStyle === 'liberty'
                                    ? 'layers-outline'
                                    : 'map-outline'
                            }
                            size={24}
                            color={colors.secondary}
                        />
                    </TouchableOpacity>

                    {/* Refresh current GPS position */}
                    <TouchableOpacity
                        style={[
                            styles.controlButton,
                            { marginTop: 10 },
                            isRefreshing && { opacity: 0.6 },
                        ]}
                        onPress={handleRefreshLocation}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? (
                            <ActivityIndicator size="small" color={colors.secondary} />
                        ) : (
                            <MaterialCommunityIcons
                                name="crosshairs-gps"
                                size={24}
                                color={colors.secondary}
                            />
                        )}
                    </TouchableOpacity>

                    {/* Route to nearest evacuation center */}
                    {showEvacuationCenters && (
                        <TouchableOpacity
                            style={[
                                styles.controlButton,
                                { marginTop: 10 },
                                routeGeoJSON && { backgroundColor: colors.info },
                            ]}
                            onPress={routeGeoJSON ? clearRoute : handleRouteToNearest}
                        >
                            <MaterialCommunityIcons
                                name={routeGeoJSON ? 'close' : 'navigation-variant'}
                                size={24}
                                color={routeGeoJSON ? 'white' : colors.secondary}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Route info card replaces the legend when a route is active */}
                {(routeGeoJSON || routeLoading || routeError) ? (
                    <RoutingInfoCard
                        destinationName={routeDestination?.name ?? ''}
                        distance={routeDistance ?? 0}
                        duration={routeDuration ?? 0}
                        isLoading={routeLoading}
                        error={routeError}
                        onCancel={clearRoute}
                    />
                ) : (
                    <View style={styles.bottomControls}>
                        <View style={styles.legend}>
                            <Text style={styles.legendTitle}>
                                Nearest Responders
                            </Text>
                            <View style={styles.legendItems}>
                                <View style={styles.legendItem}>
                                    <View
                                        style={[
                                            styles.dot,
                                            { backgroundColor: colors.success },
                                        ]}
                                    />
                                    <Text style={styles.legendText}>
                                        Evacuation
                                    </Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View
                                        style={[
                                            styles.dot,
                                            { backgroundColor: colors.info },
                                        ]}
                                    />
                                    <Text style={styles.legendText}>
                                        Hospitals
                                    </Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View
                                        style={[
                                            styles.dot,
                                            { backgroundColor: colors.critical },
                                        ]}
                                    />
                                    <Text style={styles.legendText}>
                                        Fire/Police
                                    </Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View
                                        style={[
                                            styles.dot,
                                            { backgroundColor: '#0EA5E9' },
                                        ]}
                                    />
                                    <Text style={styles.legendText}>
                                        Waterways
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    controls: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'box-none',
    },
    topControls: {
        alignItems: 'flex-end',
        padding: spacing.md,
    },
    controlButton: {
        backgroundColor: 'white',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bottomControls: {
        position: 'absolute',
        bottom: spacing.lg,
        left: spacing.md,
        right: spacing.md,
    },
    legend: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    legendTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 10,
    },
    legendItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    legendText: {
        fontSize: 11,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    markerContainer: {
        padding: 6,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
