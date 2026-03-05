import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../src/constants/colors';
import { useAlerts } from '../src/contexts/AlertContext';
import { EmergencyAlert } from '../src/types';

export default function AlertsScreen() {
    const { alerts, isLoading, refreshAlerts, markAsRead, markAllAsRead, clearRead } = useAlerts();
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    // Auto-refresh whenever the alerts screen is opened
    useEffect(() => {
        refreshAlerts();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshAlerts();
        setRefreshing(false);
    };

    const getAlertStyles = (type: string) => {
        switch (type) {
            case 'critical':
                return {
                    icon: 'alert-decagram',
                    color: colors.critical,
                    bg: '#FEF2F2',
                    border: '#FEE2E2'
                };
            case 'warning':
                return {
                    icon: 'alert-outline',
                    color: colors.warning,
                    bg: '#FFF7ED',
                    border: '#FFEDD5'
                };
            case 'advisory':
                return {
                    icon: 'information-outline',
                    color: colors.advisory,
                    bg: '#FEFCE8',
                    border: '#FEF9C3'
                };
            default:
                return {
                    icon: 'bell-outline',
                    color: colors.info,
                    bg: '#EFF6FF',
                    border: '#DBEAFE'
                };
        }
    };

    const renderItem = ({ item }: { item: EmergencyAlert }) => {
        const styles_item = getAlertStyles(item.type);

        return (
            <TouchableOpacity
                style={[
                    styles.alertCard,
                    { backgroundColor: styles_item.bg, borderColor: styles_item.border },
                    !item.isRead && { borderLeftWidth: 5, borderLeftColor: styles_item.color }
                ]}
                onPress={() => markAsRead(item.id)}
            >
                <View style={styles.alertHeader}>
                    <View style={styles.typeTag}>
                        <MaterialCommunityIcons name={styles_item.icon as any} size={18} color={styles_item.color} />
                        <Text style={[styles.typeText, { color: styles_item.color }]}>
                            {item.type.toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.timestamp}>
                        {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>

                <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>

                {!item.isRead && <View style={[styles.unreadIndicator, { backgroundColor: styles_item.color }]} />}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.secondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Alerts</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={markAllAsRead}>
                        <Text style={styles.markAll}>Read all</Text>
                    </TouchableOpacity>
                    {alerts.some(a => a.isRead) && (
                        <TouchableOpacity onPress={clearRead}>
                            <Text style={styles.clearRead}>Clear read</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList
                data={alerts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                }
                ListEmptyComponent={
                    isLoading ? (
                        <View style={styles.emptyContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={styles.emptyText}>Loading alerts...</Text>
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="bell-off-outline" size={64} color={colors.textSecondary} opacity={0.3} />
                            <Text style={styles.emptyText}>No alerts at the moment.</Text>
                            <Text style={styles.emptySubtext}>We'll notify you when something happens.</Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    markAll: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
    },
    clearRead: {
        fontSize: 13,
        color: colors.critical,
        fontWeight: '600',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    alertCard: {
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        position: 'relative',
    },

    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    typeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    timestamp: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    unreadText: {
        color: colors.secondary,
    },
    message: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    unreadIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    backButton: {
        padding: spacing.xs,
        marginLeft: -spacing.xs,
    },
});
