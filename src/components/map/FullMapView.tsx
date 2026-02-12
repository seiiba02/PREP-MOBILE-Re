import React, { useState, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants/colors';
import { config } from '../../constants/config';
import { getCityOutlineGeoJSON, getWaterwaysGeoJSON } from '../../utils/mapUtils';

const LOCATIONS = [
    {
        id: '1',
        title: 'San Juan City Hall',
        coordinate: [121.0331, 14.6053] as [number, number],
        type: 'barangay_hall',
    },
    {
        id: '2',
        title: 'San Juan Medical Center',
        coordinate: [121.0354, 14.6015] as [number, number],
        type: 'hospital',
    },
    {
        id: '3',
        title: 'Pinaglabanan Memorial Shrine',
        coordinate: [121.0305, 14.6042] as [number, number],
        type: 'evacuation',
    },
    {
        id: '4',
        title: 'San Juan Fire Station',
        coordinate: [121.0312, 14.6067] as [number, number],
        type: 'fire_station',
    },
];

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
    const cityOutline = useMemo(() => getCityOutlineGeoJSON(), []);
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
                    defaultSettings={{
                        centerCoordinate: config.maplibre.center,
                        zoomLevel: config.maplibre.zoom,
                    }}
                    minZoomLevel={config.maplibre.minZoom}
                    maxZoomLevel={config.maplibre.maxZoom}
                />

                {/* San Juan City Outline — all 21 barangay polygons */}
                <MapLibreGL.ShapeSource
                    id="city-outline-source"
                    shape={cityOutline as any}
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

                {/* Location Markers */}
                {LOCATIONS.map((loc) => (
                    <MapLibreGL.PointAnnotation
                        key={loc.id}
                        id={`marker-${loc.id}`}
                        coordinate={loc.coordinate}
                        title={loc.title}
                    >
                        <View
                            style={[
                                styles.markerContainer,
                                { backgroundColor: markerColor(loc.type) },
                            ]}
                        >
                            <MaterialCommunityIcons
                                name={markerIcon(loc.type) as any}
                                size={20}
                                color="white"
                            />
                        </View>
                    </MapLibreGL.PointAnnotation>
                ))}

                <MapLibreGL.UserLocation visible={true} />
            </MapLibreGL.MapView>

            {/* Floating Controls */}
            <SafeAreaView style={styles.controls}>
                <View style={styles.topControls}>
                    <TouchableOpacity
                        style={styles.controlButton}
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
