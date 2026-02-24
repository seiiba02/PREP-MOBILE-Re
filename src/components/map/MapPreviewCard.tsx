import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { config } from '../../constants/config';
import { colors } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import { getCityOutlineGeoJSON, getBarangayGeoJSON, getBarangayBoundsArray } from '../../utils/mapUtils';

interface MapPreviewCardProps {
    onPress?: () => void;
}

export function MapPreviewCard({ onPress }: MapPreviewCardProps) {
    const { user } = useAuth();

    const displayGeoJSON = useMemo(() => {
        if (user?.barangay) {
            const barangayData = getBarangayGeoJSON(user.barangay);
            if (barangayData.features.length > 0) {
                return barangayData;
            }
        }
        return getCityOutlineGeoJSON();
    }, [user?.barangay]);

    const bounds = useMemo(() => {
        if (user?.barangay) {
            return getBarangayBoundsArray(user.barangay);
        }
        return null;
    }, [user?.barangay]);

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
                        defaultSettings={bounds ? {
                            bounds: {
                                sw: bounds[0],
                                ne: bounds[1],
                                paddingLeft: 20,
                                paddingRight: 20,
                                paddingTop: 20,
                                paddingBottom: 20
                            },
                        } : {
                            centerCoordinate: config.maplibre.center,
                            zoomLevel: config.maplibre.previewZoom,
                        }}
                    />

                    <MapLibreGL.ShapeSource
                        id="preview-outline-source"
                        shape={displayGeoJSON as any}
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
