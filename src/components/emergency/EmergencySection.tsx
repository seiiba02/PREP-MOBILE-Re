import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SOSButton } from './SOSButton';
import { EmergencyButton } from './EmergencyButton';
import { emergencyContacts } from '../../constants/emergencyContacts';
import { spacing, colors } from '../../constants/colors';

interface EmergencySectionProps {
    onSOSPress: () => void;
}

export const EmergencySection = ({ onSOSPress }: EmergencySectionProps) => {
    // Find specific contacts from central constants
    const fireContact = emergencyContacts.find(c => c.category === 'fire');
    const policeContact = emergencyContacts.find(c => c.category === 'police');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Emergency Services</Text>
            <View style={styles.card}>
                {/* Primary: SOS */}
                <SOSButton onPress={onSOSPress} />

                {/* Secondary: Fire & Police */}
                <View style={styles.secondaryRow}>
                    <EmergencyButton
                        label="BFP Fire"
                        icon="fire"
                        number={fireContact?.number || '8725-2079'}
                        backgroundColor="#F97316"
                    />
                    <EmergencyButton
                        label="Police"
                        icon="shield-account"
                        number={policeContact?.number || '8356-9314'}
                        backgroundColor={colors.secondary}
                    />
                </View>
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
