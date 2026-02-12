import React, { useRef } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width * 0.75;
const THUMB_SIZE = 66;
const TRACK_HEIGHT = 76;
const SLIDE_THRESHOLD = SLIDER_WIDTH - THUMB_SIZE - 16;

interface SOSSliderProps {
    onSlideComplete: () => void;
}

export const SOSSlider = ({ onSlideComplete }: SOSSliderProps) => {
    const translateX = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const newX = Math.max(0, Math.min(gestureState.dx, SLIDE_THRESHOLD));
                translateX.setValue(newX);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx >= SLIDE_THRESHOLD) {
                    // Slide completed
                    onSlideComplete();
                } else {
                    // Reset to start
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: false,
                        tension: 50,
                        friction: 8,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <View style={styles.container}>
            <View style={styles.track}>
                <Animated.View
                    style={[
                        styles.fill,
                        {
                            width: translateX.interpolate({
                                inputRange: [0, SLIDE_THRESHOLD],
                                outputRange: [THUMB_SIZE + 8, SLIDER_WIDTH],
                                extrapolate: 'clamp'
                            })
                        }
                    ]}
                />

                <Text style={styles.label}>Emergency SOS</Text>

                <Animated.View
                    style={[
                        styles.thumb,
                        { transform: [{ translateX }] },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.sosIcon}>
                        <Text style={styles.sosText}>SOS</Text>
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    track: {
        width: SLIDER_WIDTH,
        height: TRACK_HEIGHT,
        backgroundColor: 'rgba(60, 60, 60, 0.9)',
        borderRadius: TRACK_HEIGHT / 2,
        justifyContent: 'center',
        paddingHorizontal: 8,
        overflow: 'hidden', // Ensure trail doesn't leak out
    },
    fill: {
        position: 'absolute',
        left: 0,
        height: '100%',
        backgroundColor: '#FF4D4D',
        borderRadius: TRACK_HEIGHT / 2,
    },
    label: {
        position: 'absolute',
        alignSelf: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    thumb: {
        position: 'absolute',
        left: 4,
    },
    sosIcon: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: '#FF4D4D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sosText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
