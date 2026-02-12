/**
 * MapPreviewCard — live MapLibre map for the dashboard.
 *
 * ⚠️  This file imports @maplibre/maplibre-react-native directly.
 *     It must ONLY be rendered inside <MapWrapper> so that Expo Go
 *     never evaluates this module.
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { config } from '../../constants/config';
import { colors } from '../../constants/colors';
import { getCityOutlineGeoJSON } from '../../utils/mapUtils';

interface MapPreviewCardProps {
    onPress?: () => void;
}

export function MapPreviewCard({ onPress }: MapPreviewCardProps) {
    const cityOutline = useMemo(() => getCityOutlineGeoJSON(), []);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.mapContainer} pointerEvents="none">
                <MapLibreGL.MapView
                    style={styles.map}
                    mapStyle={config.maplibre.styleUrl}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    attributionEnabled={false}
                    logoEnabled={false}
                    compassEnabled={false}
                >
                    <MapLibreGL.Camera
                        defaultSettings={{
                            centerCoordinate: config.maplibre.center,
                            zoomLevel: config.maplibre.previewZoom,
                        }}
                    />

                    <MapLibreGL.ShapeSource
                        id="preview-outline-source"
                        shape={cityOutline as any}
                    >
                        <MapLibreGL.FillLayer
                            id="preview-outline-fill"
                            style={{
                                fillColor: 'rgba(27, 37, 96, 0.08)',
                                fillOutlineColor: colors.secondary,
                            }}
                        />
                        <MapLibreGL.LineLayer
                            id="preview-outline-line"
                            style={{
                                lineColor: colors.secondary,
                                lineWidth: 1.5,
                                lineOpacity: 0.7,
                            }}
                        />
                    </MapLibreGL.ShapeSource>
                </MapLibreGL.MapView>
            </View>

            <View style={styles.labelOverlay}>
                <MaterialCommunityIcons
                    name="map-search-outline"
                    size={16}
                    color="white"
                />
                <Text style={styles.labelText}>View Full Map</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 220,
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        position: 'relative',
    },
    mapContainer: {
        width: '100%',
        height: '100%',
    },
    map: {
        flex: 1,
    },
    labelOverlay: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(27, 37, 96, 0.85)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    labelText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});
