import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNetwork } from '../../contexts/NetworkContext';

export function OfflineBanner() {
    const { isConnected } = useNetwork();
    const translateY = useRef(new Animated.Value(-60)).current;
    const insets = useSafeAreaInsets();

    const isOffline = isConnected === false;

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: isOffline ? 0 : -60,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isOffline, translateY]);

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
        gap: 8,
    },
    text: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },
});
