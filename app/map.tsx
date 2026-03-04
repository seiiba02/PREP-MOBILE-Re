import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MapWrapper, isDevBuild } from '../src/components/map/MapWrapper';

// Only resolve the MapLibre component when native modules exist.
const FullMapView = isDevBuild
    ? require('../src/components/map/FullMapView').FullMapView
    : () => null;

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <MapWrapper
                fallbackTitle="Interactive City Map"
                fallbackHeight="100%"
            >
                <FullMapView />
            </MapWrapper>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
