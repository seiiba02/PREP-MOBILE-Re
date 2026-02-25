import React, { useState, useMemo, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants/colors';
import { config } from '../../constants/config';
import { getCityOutlineGeoJSON, getWaterwaysGeoJSON, getBarangayGeoJSON, getBarangayBoundsArray } from '../../utils/mapUtils';
import { useAuth } from '../../contexts/AuthContext';
import { getEvacuationCenters, ApiEvacuationCenter } from '../../services/api';


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
    const [mapStyle, setMapStyle] = useState<'liberty' | 'positron'>('liberty');
    const [isSingleBarangayView, setIsSingleBarangayView] = useState(false);
    const [showEvacuationCenters, setShowEvacuationCenters] = useState(false);
    const [evacuationCenters, setEvacuationCenters] = useState<ApiEvacuationCenter[]>([]);
    const { user } = useAuth();

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
                    bounds={
                        currentBounds
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
                    centerCoordinate={!currentBounds ? config.maplibre.center : undefined}
                    zoomLevel={!currentBounds ? config.maplibre.zoom : undefined}
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

                <MapLibreGL.UserLocation visible={true} />

                {/* Evacuation Centers Markers */}
                {showEvacuationCenters && evacuationCenters.map((center) => (
                    <MapLibreGL.PointAnnotation
                        key={center.id}
                        id={`evac-${center.id}`}
                        coordinate={[center.location_longitude, center.location_latitude]}
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
                        onPress={() => setShowEvacuationCenters(!showEvacuationCenters)}
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
                </View>

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
