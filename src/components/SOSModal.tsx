import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Linking, Platform, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { SOSSlider } from './SOSSlider';
import { EMERGENCY_NUMBER } from '../constants/emergency';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as IntentLauncher from 'expo-intent-launcher';

const { height } = Dimensions.get('window');

interface SOSModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SOSModal = ({ visible, onClose }: SOSModalProps) => {
    const handleSlideComplete = () => {
        // Immediately initiate call
        // Change to instant call in production
        Linking.openURL(`tel:${EMERGENCY_NUMBER}`);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <BlurView intensity={100} tint="dark" style={styles.blurContainer}>
                <LinearGradient
                    colors={['rgba(50, 20, 15, 0.96)', 'rgba(10, 10, 10, 0.98)']}
                    style={styles.overlay}
                >
                    {/* SOS Slider */}
                    <View style={styles.sliderContainer}>
                        <SOSSlider onSlideComplete={handleSlideComplete} />
                        <Text style={styles.instructionText}>Slide to call Emergency Services</Text>
                    </View>

                    {/* Cancel Button */}
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <View style={styles.cancelIconWrapper}>
                            <MaterialCommunityIcons name="close" size={36} color="white" />
                        </View>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    blurContainer: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: height * 0.05,
    },
    sliderContainer: {
        alignItems: 'center',
        marginBottom: 80,
    },
    instructionText: {
        color: 'white',
        marginTop: 16,
        fontSize: 14,
        fontWeight: '500',
        opacity: 0.9,
    },
    cancelButton: {
        alignItems: 'center',
        marginTop: 60,
    },
    cancelIconWrapper: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    cancelText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});


