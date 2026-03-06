import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants/colors';

interface OfflineEmptyStateProps {
    onRetry?: () => void;
}

export function OfflineEmptyState({ onRetry }: OfflineEmptyStateProps) {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name="wifi-off" size={64} color={colors.textSecondary} style={styles.icon} />
            <Text style={styles.title}>You're offline</Text>
            <Text style={styles.subtitle}>Connect to the internet to see the latest data.</Text>
            {onRetry && (
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: spacing.xl,
    },
    icon: {
        opacity: 0.3,
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    retryButton: {
        marginTop: spacing.lg,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
        backgroundColor: colors.secondary,
        borderRadius: 100,
    },
    retryText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});
