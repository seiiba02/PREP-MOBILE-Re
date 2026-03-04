import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants/colors';

interface MapPlaceholderProps {
    title?: string;
    height?: number | string;
    onPress?: () => void;
}

export function MapPlaceholder({ 
    title = "Live Map Preview", 
    height = 220,
    onPress 
}: MapPlaceholderProps) {
    const handleLearnMore = () => {
        Linking.openURL('https://docs.expo.dev/develop/development-builds/introduction/');
    };

    const containerStyle: ViewStyle = {
        ...styles.container as any,
        height: typeof height === 'number' ? height : undefined,
        flex: height === '100%' ? 1 : undefined,
    };

    const content = (
        <View style={containerStyle}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons 
                    name="map-marker-radius-outline" 
                    size={48} 
                    color={colors.secondary} 
                />
            </View>
            
            <Text style={styles.title}>{title}</Text>
            
            <View style={styles.messageContainer}>
                <MaterialCommunityIcons 
                    name="information-outline" 
                    size={16} 
                    color={colors.textSecondary} 
                />
                <Text style={styles.message}>
                    MapLibre maps require a development build
                </Text>
            </View>

            <View style={styles.commandContainer}>
                <Text style={styles.commandLabel}>Build with:</Text>
                <Text style={styles.command}>eas build --profile development</Text>
            </View>

            <TouchableOpacity 
                style={styles.learnButton}
                onPress={handleLearnMore}
            >
                <Text style={styles.learnButtonText}>Learn More</Text>
                <MaterialCommunityIcons 
                    name="arrow-right" 
                    size={16} 
                    color={colors.secondary} 
                />
            </TouchableOpacity>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: spacing.md,
    },
    message: {
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    commandContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: spacing.sm,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    commandLabel: {
        fontSize: 11,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    command: {
        fontFamily: 'monospace',
        fontSize: 12,
        color: colors.secondary,
        fontWeight: '600',
    },
    learnButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#EEF2FF',
        borderRadius: 8,
    },
    learnButtonText: {
        fontSize: 13,
        color: colors.secondary,
        fontWeight: '600',
    },
});
