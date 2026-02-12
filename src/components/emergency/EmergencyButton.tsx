import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants/colors';

interface EmergencyButtonProps {
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    number: string;
    backgroundColor: string;
}

export const EmergencyButton = ({ label, icon, number, backgroundColor }: EmergencyButtonProps) => {
    const handleCall = () => {
        Linking.openURL(`tel:${number}`);
    };

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }]}
            onPress={handleCall}
            activeOpacity={0.8}
        >
            <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name={icon} size={24} color="white" />
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
        height: 60,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    label: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
