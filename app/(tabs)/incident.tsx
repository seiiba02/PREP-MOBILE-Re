import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, RefreshControl, AppState, AppStateStatus } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../src/constants/colors';
import { sharedStyles } from './_layout';
import { SharedHeader } from '../../src/components/SharedHeader';
import { useAuth } from '../../src/contexts/AuthContext';
import { getRecentIncidents, getTodayIncidentStats, ApiIncident, ApiIncidentStats } from '../../src/services/api';
import { IncidentSkeleton } from '../../src/components/common/IncidentSkeleton';
import { OfflineEmptyState } from '../../src/components/common/OfflineEmptyState';
import { useNetwork } from '../../src/contexts/NetworkContext';

const { width } = Dimensions.get('window');

// ─── Incident Type Config (Mirrored from Backend Hazard Classifications) ─
const INCIDENT_TYPES: Record<string, { icon: string; color: string; label: string }> = {
    // Natural
    'Flood': { icon: 'waves', color: '#3b82f6', label: 'Flood' },
    'Earthquake': { icon: 'alert-circle', color: '#f59e0b', label: 'Earthquake' },
    'Typhoon': { icon: 'weather-lightning', color: '#0ea5e9', label: 'Typhoon' },

    // Man-Induced
    'Vehicular_Accidents': { icon: 'car', color: '#ef4444', label: 'Vehicular' },
    'General_Incidents': { icon: 'flash', color: '#64748b', label: 'General' },
    'Fire': { icon: 'fire', color: '#dc2626', label: 'Fire' },
    'Power_Outage': { icon: 'lightning-bolt', color: '#facc15', label: 'Power Outage' },
    'System_Failure': { icon: 'cog', color: '#94a3b8', label: 'System Failure' },
    'War': { icon: 'sword-cross', color: '#7f1d1d', label: 'War' },
    'Rally': { icon: 'bullhorn', color: '#f97316', label: 'Rally' },

    // Health
    'Medical_Cases': { icon: 'stethoscope', color: '#10b981', label: 'Medical' },
    'Trauma': { icon: 'pulse', color: '#8b5cf6', label: 'Trauma' },
    'Chemical': { icon: 'flask', color: '#14b8a6', label: 'Chemical' },
    'Biological': { icon: 'microscope', color: '#84cc16', label: 'Biological' },
    'Radiological': { icon: 'radioactive', color: '#eab308', label: 'Radiological' },
    'Nuclear': { icon: 'atom', color: '#f59e0b', label: 'Nuclear' },
    'High_Yield_Explosives': { icon: 'bomb', color: '#b91c1c', label: 'Explosives' },
    'Virus_Outbreak': { icon: 'bug', color: '#10b981', label: 'Virus Outbreak' },
};

// Fallback config if category is unknown
const DEFAULT_INCIDENT_CONFIG = { icon: 'alert', color: colors.info, label: 'Unknown' };

// ─── Format Helpers ─────────────────────────────────────────────────────

function formatTimeAgo(dateStr: string, timeStr: string): string {
    if (!dateStr || !timeStr) return 'Unknown time';

    // Parse the dateStr to handle UTC to Local conversion. 
    // Backend serializes "midnight local date" as e.g. "2026-03-04T16:00:00.000000Z".
    const parsedDate = new Date(dateStr);

    if (isNaN(parsedDate.getTime())) {
        return 'Unknown time';
    }

    // Extract the corrected local date segments
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const localDateString = `${year}-${month}-${day}`;

    // Ensure the time string has a consistent format (HH:mm:ss)
    const cleanTime = timeStr.trim();

    // Create final local Date object
    const incidentDateTime = new Date(`${localDateString}T${cleanTime}`);

    if (isNaN(incidentDateTime.getTime())) {
        return 'Unknown time';
    }

    const now = new Date();

    // Compare dates based on local calendar days to determine "Today" vs "Yesterday"
    const isToday = now.toDateString() === incidentDateTime.toDateString();

    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(now.getDate() - 1);
    const isYesterday = yesterdayDate.toDateString() === incidentDateTime.toDateString();

    const diffMs = now.getTime() - incidentDateTime.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (isToday) {
        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin} min ago`;
        return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    }

    if (isYesterday) {
        return 'Yesterday';
    }

    if (diffDay < 7) {
        return `${diffDay} days ago`;
    }

    return incidentDateTime.toLocaleDateString();
}

function getLocationString(incident: ApiIncident): string {
    const barangay = incident.barangay?.name || incident.location_barangay;
    const street = incident.street || incident.location_specific;

    // Attempt to string things together nicely
    if (street && street !== 'N/A' && barangay && barangay !== 'N/A' && barangay !== 'ALL') {
        return `${street}, Brgy. ${barangay}`;
    } else if (barangay && barangay !== 'N/A' && barangay !== 'ALL') {
        return `Brgy. ${barangay}, San Juan City`;
    } else if (street && street !== 'N/A') {
        return `${street}, San Juan City`;
    }
    return 'San Juan City';
}

// ─── Component ──────────────────────────────────────────────────────────
export default function IncidentScreen() {
    const { user } = useAuth();
    const { isConnected } = useNetwork();

    const [recentIncidents, setRecentIncidents] = useState<ApiIncident[]>([]);
    const [todayStats, setTodayStats] = useState<ApiIncidentStats>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [incidents, stats] = await Promise.all([
                getRecentIncidents(15),
                getTodayIncidentStats()
            ]);
            setRecentIncidents(incidents);
            setTodayStats(stats);
        } catch (error) {
            console.error("Failed to fetch incident data", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Re-fetch when the app returns to the foreground (e.g. after tapping a push notification)
    const appState = useRef<AppStateStatus>(AppState.currentState);
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextState) => {
            if (appState.current.match(/inactive|background/) && nextState === 'active') {
                fetchData();
            }
            appState.current = nextState;
        });
        return () => subscription.remove();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return colors.critical;
            case 'warning': return colors.warning;
            case 'advisory': return colors.advisory;
            default: return colors.info;
        }
    };

    // Transform today Stats into sorted array for UI
    const todayTotal = Object.values(todayStats).reduce((acc, val) => acc + val, 0);
    const typeBreakdown = Object.entries(todayStats)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]);
    const maxTypeCount = typeBreakdown.length > 0 ? Math.max(...typeBreakdown.map(([, count]) => count)) : 1;

    return (
        <View style={sharedStyles.container}>


            <ScrollView
                style={sharedStyles.mainContent}
                contentContainerStyle={sharedStyles.scrollContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
            >
                <SharedHeader />
                <View style={[sharedStyles.whiteContainer]}>
                    <Text style={sharedStyles.greeting}>Hello, {user?.fullName ?? 'User'}!</Text>
                    <View style={sharedStyles.separator} />

                    <Text style={sharedStyles.sectionTitle}>Incident Report</Text>

                    {/* ── GPS Location Placeholder ── */}
                    {/* GPS: Replace with expo-location in production */}
                    <TouchableOpacity style={styles.locationBanner} activeOpacity={0.8}>
                        <LinearGradient
                            colors={[colors.secondary, '#2D3A80']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.locationGradient}
                        >
                            <View style={styles.locationIconBg}>
                                <MaterialCommunityIcons name="crosshairs-gps" size={20} color="white" />
                            </View>
                            <View style={styles.locationTextWrapper}>
                                <Text style={styles.locationLabel}>Showing incidents near</Text>
                                <Text style={styles.locationAddress}>San Juan City, Metro Manila</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={22} color="rgba(255,255,255,0.5)" />
                        </LinearGradient>
                    </TouchableOpacity>

                    {loading && !refreshing ? (
                        <IncidentSkeleton />
                    ) : isConnected === false && recentIncidents.length === 0 ? (
                        <OfflineEmptyState onRetry={fetchData} />
                    ) : (
                        <>
                            {/* ── Today's Summary Card ── */}
                            <View style={styles.todaySummaryCard}>
                                <View style={styles.summaryHeader}>
                                    <View style={styles.todayBadge}>
                                        <Text style={styles.todayBadgeText}>TODAY</Text>
                                    </View>
                                    <Text style={styles.summaryTitle}>Incident Summary</Text>
                                </View>
                                <View style={styles.summaryContent}>
                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryValue}>{todayTotal}</Text>
                                        <Text style={styles.summaryLabel}>Total Incidents</Text>
                                    </View>
                                </View>
                            </View>

                            {/* ── Incident Type Breakdown ── */}
                            {typeBreakdown.length > 0 && (
                                <>
                                    <Text style={styles.subSectionTitle}>By Type (Today)</Text>
                                    <View style={styles.typeBreakdownCard}>
                                        {typeBreakdown.map(([type, count]) => {
                                            const config = INCIDENT_TYPES[type] || DEFAULT_INCIDENT_CONFIG;
                                            const barWidth = (count / maxTypeCount) * 100;
                                            return (
                                                <View key={type} style={styles.typeRow}>
                                                    <View style={styles.typeIconRow}>
                                                        <View style={[styles.typeIconBg, { backgroundColor: config.color + '18' }]}>
                                                            <MaterialCommunityIcons name={config.icon as any} size={16} color={config.color} />
                                                        </View>
                                                        <Text style={styles.typeLabel} numberOfLines={1}>{config.label}</Text>
                                                    </View>
                                                    <View style={styles.barContainer}>
                                                        <View style={[styles.bar, { width: `${barWidth}%`, backgroundColor: config.color }]} />
                                                    </View>
                                                    <Text style={styles.typeCount}>{count}</Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </>
                            )}

                            {/* ── Recent Incidents Feed ── */}
                            <Text style={styles.subSectionTitle}>Recent Incidents</Text>
                            <View style={styles.incidentList}>
                                {recentIncidents.length === 0 ? (
                                    <View style={{ padding: 20, alignItems: 'center' }}>
                                        <Text style={{ color: colors.textSecondary }}>No recent incidents found.</Text>
                                    </View>
                                ) : (
                                    recentIncidents.map((incident) => {
                                        const typeConfig = INCIDENT_TYPES[incident.incident_category] || DEFAULT_INCIDENT_CONFIG;
                                        return (
                                            <TouchableOpacity key={incident.id} style={styles.incidentCard} activeOpacity={0.7}>
                                                <View style={styles.incidentBody}>
                                                    {/* Top row: icon + title + status */}
                                                    <View style={styles.incidentTopRow}>
                                                        <View style={[styles.incidentIconBg, { backgroundColor: typeConfig.color + '18' }]}>
                                                            <MaterialCommunityIcons name={typeConfig.icon as any} size={20} color={typeConfig.color} />
                                                        </View>
                                                        <View style={styles.incidentTitleBlock}>
                                                            <View style={styles.incidentTitleRow}>
                                                                <Text style={styles.incidentTitle} numberOfLines={1}>
                                                                    {incident.incident_category.replace(/_/g, ' ')} Incident
                                                                </Text>
                                                            </View>
                                                            <View style={styles.incidentMeta}>
                                                                <View style={[styles.typeBadge, { backgroundColor: typeConfig.color + '18' }]}>
                                                                    <Text style={[styles.typeBadgeText, { color: typeConfig.color }]}>{typeConfig.label}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    {/* Bottom row: location + time */}
                                                    <View style={styles.incidentBottomRow}>
                                                        <View style={styles.incidentLocationRow}>
                                                            <MaterialCommunityIcons name="map-marker-outline" size={14} color="#94A3B8" />
                                                            <Text style={styles.incidentLocation} numberOfLines={1}>
                                                                {getLocationString(incident)}
                                                            </Text>
                                                        </View>
                                                        <Text style={styles.incidentTime}>
                                                            {formatTimeAgo(incident.incident_date, incident.incident_time)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })
                                )}
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // Location Banner
    locationBanner: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: spacing.lg,
    },
    locationGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    locationIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    locationTextWrapper: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
    },
    locationAddress: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 2,
    },

    // Trend Summary
    todaySummaryCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 8,
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    todayBadge: {
        backgroundColor: 'rgba(27, 37, 96, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    todayBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: colors.secondary,
        letterSpacing: 1,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    summaryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryValue: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.secondary,
    },
    summaryLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94A3B8',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#F1F5F9',
    },

    // Category Selector
    categoryContainer: {
        marginBottom: spacing.lg,
        marginLeft: -spacing.md,
        marginRight: -spacing.md,
    },
    categoryContent: {
        paddingHorizontal: spacing.md,
        gap: 12,
        paddingBottom: 8,
    },
    categoryCard: {
        width: 85,
        height: 110,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoryCardSelected: {
        borderColor: colors.info,
        borderWidth: 2,
        elevation: 4,
        shadowColor: colors.info,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    categoryIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryIconWrapperSelected: {
        backgroundColor: colors.info + '10',
    },
    categoryText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#94A3B8',
        textAlign: 'center',
    },
    categoryTextSelected: {
        color: colors.info,
    },

    // Sub-Section Title
    subSectionTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.secondary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Type Breakdown
    typeBreakdownCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: spacing.lg,
    },
    typeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 110,
    },
    typeIconBg: {
        width: 30,
        height: 30,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    typeLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
    },
    barContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        overflow: 'hidden',
        marginHorizontal: 8,
    },
    bar: {
        height: '100%',
        borderRadius: 4,
    },
    typeCount: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.secondary,
        width: 24,
        textAlign: 'right',
    },

    // Incident Cards
    incidentList: {
        gap: 12,
        marginBottom: spacing.xl,
    },
    incidentCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    incidentAccent: {
        width: 4,
    },
    incidentBody: {
        flex: 1,
        padding: 14,
    },
    incidentTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    incidentIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    incidentTitleBlock: {
        flex: 1,
    },
    incidentTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    incidentTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
        flex: 1,
    },
    incidentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    typeBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        gap: 4,
    },
    statusActive: {
        backgroundColor: 'rgba(220, 38, 38, 0.08)',
    },
    statusResolved: {
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    incidentBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    incidentLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    incidentLocation: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
        flex: 1,
    },
    incidentTime: {
        fontSize: 12,
        color: '#CBD5E1',
        fontWeight: '600',
    },
});
