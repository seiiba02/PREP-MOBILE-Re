import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNetwork } from '../../contexts/NetworkContext';

const BANNER_HEIGHT = 32;

export function OfflineBanner() {
    const { isConnected } = useNetwork();
    const insets = useSafeAreaInsets();
    const hiddenOffset = -(insets.top + BANNER_HEIGHT + 8);
    const translateY = useRef(new Animated.Value(hiddenOffset)).current;

    const isOffline = isConnected === false;

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: isOffline ? 0 : hiddenOffset,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [hiddenOffset, isOffline, translateY]);

    return (
        <Animated.View
            style={[
                styles.banner,
                { top: insets.top, transform: [{ translateY }] },
            ]}
            pointerEvents="none"
        >
            <MaterialCommunityIcons name="wifi-off" size={16} color="white" />
            <Text style={styles.text}>No internet connection</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    banner: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#DC2626',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        minHeight: BANNER_HEIGHT,
        gap: 8,
    },
    text: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },
});
