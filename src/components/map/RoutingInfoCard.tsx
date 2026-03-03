import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants/colors';
import { formatDistance, formatDuration } from '../../utils/geoUtils';

interface RoutingInfoCardProps {
    destinationName: string;
    /** Route distance in metres */
    distance: number;
    /** Estimated travel time in seconds */
    duration: number;
    isLoading: boolean;
    error: string | null;
    onCancel: () => void;
}

/**
 * Floating card displayed at the bottom of the map when a route is active.
 *
 * States:
 * - **Loading** — spinner + "Calculating route…"
 * - **Error**   — red message + close button
 * - **Active**  — destination name, distance, ETA, close button
 */
export function RoutingInfoCard({
    destinationName,
    distance,
    duration,
    isLoading,
    error,
    onCancel,
}: RoutingInfoCardProps) {
    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingRow}>
                    <ActivityIndicator color={colors.info} size="small" />
                    <Text style={styles.loadingText}>Calculating route…</Text>
                </View>
            ) : error ? (
                <View style={styles.errorRow}>
                    <MaterialCommunityIcons
                        name="alert-circle-outline"
                        size={20}
                        color={colors.error}
                    />
                    <Text style={styles.errorText} numberOfLines={2}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        onPress={onCancel}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <MaterialCommunityIcons
                            name="close"
                            size={22}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <View style={styles.header}>
                        <MaterialCommunityIcons
                            name="navigation-variant"
                            size={20}
                            color={colors.info}
                        />
                        <Text style={styles.destName} numberOfLines={1}>
                            {destinationName}
                        </Text>
                        <TouchableOpacity
                            onPress={onCancel}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <MaterialCommunityIcons
                                name="close"
                                size={22}
                                color={colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <MaterialCommunityIcons
                                name="map-marker-distance"
                                size={16}
                                color={colors.textSecondary}
                            />
                            <Text style={styles.statValue}>
                                {formatDistance(distance)}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.stat}>
                            <MaterialCommunityIcons
                                name="clock-outline"
                                size={16}
                                color={colors.textSecondary}
                            />
                            <Text style={styles.statValue}>
                                {formatDuration(duration)}
                            </Text>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: spacing.lg,
        left: spacing.md,
        right: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    destName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginLeft: spacing.sm,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.textPrimary,
        marginLeft: 6,
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: colors.border,
        marginHorizontal: spacing.sm,
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xs,
    },
    loadingText: {
        marginLeft: spacing.sm,
        fontSize: 14,
        color: colors.textSecondary,
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        color: colors.error,
        marginHorizontal: spacing.sm,
    },
});
