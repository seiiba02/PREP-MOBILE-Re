import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SOSButton } from './SOSButton';
import { colors } from '../../constants/colors';

interface EmergencySectionProps {
    onSOSPress: () => void;
}

export const EmergencySection = ({ onSOSPress }: EmergencySectionProps) => {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Emergency Service</Text>
            <View style={styles.card}>
                {/* Primary: SOS */}
                <SOSButton onPress={onSOSPress} />
                <Text style={styles.footerText}>Tap to call emergency services directly</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        marginBottom: 32,
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.secondary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
    },
    secondaryRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    footerText: {
        fontSize: 11,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 16,
        fontStyle: 'italic',
    },
});
