import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonProps {
    width: number | string;
    height: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export function Skeleton({ width, height, borderRadius = 8, style }: SkeletonProps) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                styles.base,
                { width: width as any, height, borderRadius, opacity },
                style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: '#CBD5E1',
    },
});
