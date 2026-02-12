import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../src/constants/colors';
import { sharedStyles } from './_layout';
import { SharedHeader } from '../../src/components/SharedHeader';

const { width } = Dimensions.get('window');

// ─── Incident Type Config ───────────────────────────────────────────────
const INCIDENT_TYPES: Record<string, { icon: string; color: string; label: string }> = {
    medical: { icon: 'stethoscope', color: colors.info, label: 'Medical' },
    trauma: { icon: 'pulse', color: '#8B5CF6', label: 'Trauma' },
    vehicular: { icon: 'car', color: colors.warning, label: 'Vehicular' },
    general: { icon: 'flash', color: colors.textSecondary, label: 'General' },
    flood: { icon: 'waves', color: '#0EA5E9', label: 'Flood' },
    earthquake: { icon: 'alert-circle-outline', color: '#EAB308', label: 'Earthquake' },
    fire: { icon: 'fire', color: colors.critical, label: 'Fire' },
};

// ─── Mock Incidents ─────────────────────────────────────────────────────
const MOCK_INCIDENTS = [
    {
        id: '1',
        title: 'Residential Fire Reported',
        type: 'fire',
        location: 'Brgy. Kabayanan, San Juan City',
        timeAgo: '25 min ago',
        status: 'active' as const,
        severity: 'critical' as const,
        isToday: true,
    },
    {
        id: '2',
        title: 'Street Flooding Map',
        type: 'flood',
        location: 'N. Domingo St., San Juan City',
        timeAgo: '1 hour ago',
        status: 'active' as const,
        severity: 'warning' as const,
        isToday: true,
    },
    {
        id: '3',
        title: 'Minor Vehicle Collision',
        type: 'vehicular',
        location: 'Pinaglabanan St., San Juan City',
        timeAgo: '2 hours ago',
        status: 'resolved' as const,
        severity: 'advisory' as const,
        isToday: true,
    },
    {
        id: '4',
        title: 'Medical Assistance Required',
        type: 'medical',
        location: 'Brgy. Maytunas, San Juan City',
        timeAgo: '3 hours ago',
        status: 'resolved' as const,
        severity: 'warning' as const,
        isToday: true,
    },
    {
        id: '5',
        title: 'Severe Earthquake Aftershock',
        type: 'earthquake',
        location: 'City Wide Impact',
        timeAgo: 'Today, 8:00 AM',
        status: 'resolved' as const,
        severity: 'critical' as const,
        isToday: true,
    },
    {
        id: '6',
        title: 'Reported Trauma Case',
        type: 'trauma',
        location: 'Brgy. St. Joseph, San Juan City',
        timeAgo: 'Yesterday',
        status: 'resolved' as const,
        severity: 'advisory' as const,
        isToday: false,
    },
    {
        id: '7',
        title: 'General Utility Fault',
        type: 'general',
        location: 'Brgy. Tibagan, San Juan City',
        timeAgo: 'Yesterday',
        status: 'resolved' as const,
        severity: 'warning' as const,
        isToday: false,
    },
];

// ─── Trend Summary Data ─────────────────────────────────────────────────
const TODAY_INCIDENTS = MOCK_INCIDENTS.filter(i => i.isToday);
const TODAY_STATS = {
    total: TODAY_INCIDENTS.length,
    active: TODAY_INCIDENTS.filter(i => i.status === 'active').length,
    resolved: TODAY_INCIDENTS.filter(i => i.status === 'resolved').length,
};

// ─── Incident Type Counts ───────────────────────────────────────────────
const TYPE_COUNTS = Object.entries(
    MOCK_INCIDENTS.reduce((acc, inc) => {
        acc[inc.type] = (acc[inc.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>)
).sort((a, b) => b[1] - a[1]);

const MAX_TYPE_COUNT = Math.max(...TYPE_COUNTS.map(([, count]) => count));

// ─── Component ──────────────────────────────────────────────────────────
export default function IncidentScreen() {

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return colors.critical;
            case 'warning': return colors.warning;
            case 'advisory': return colors.advisory;
            default: return colors.info;
        }
    };

    return (
        <View style={sharedStyles.container}>
            <SharedHeader />

            <ScrollView
                style={sharedStyles.mainContent}
                contentContainerStyle={sharedStyles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <SharedHeader />
                <View style={[sharedStyles.whiteContainer]}>
                    <Text style={sharedStyles.greeting}>Hello, Sambajunnie Boi!</Text>
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
                                <Text style={styles.summaryValue}>{TODAY_STATS.total}</Text>
                                <Text style={styles.summaryLabel}>Total</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={[styles.summaryValue, { color: colors.critical }]}>{TODAY_STATS.active}</Text>
                                <Text style={styles.summaryLabel}>Active</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={[styles.summaryValue, { color: colors.success }]}>{TODAY_STATS.resolved}</Text>
                                <Text style={styles.summaryLabel}>Resolved</Text>
                            </View>
                        </View>
                    </View>

                    {/* ── Incident Type Breakdown ── */}
                    <Text style={styles.subSectionTitle}>By Type</Text>
                    <View style={styles.typeBreakdownCard}>
                        {TYPE_COUNTS.map(([type, count]) => {
                            const config = INCIDENT_TYPES[type];
                            const barWidth = (count / MAX_TYPE_COUNT) * 100;
                            return (
                                <View key={type} style={styles.typeRow}>
                                    <View style={styles.typeIconRow}>
                                        <View style={[styles.typeIconBg, { backgroundColor: config.color + '18' }]}>
                                            <MaterialCommunityIcons name={config.icon as any} size={16} color={config.color} />
                                        </View>
                                        <Text style={styles.typeLabel}>{config.label}</Text>
                                    </View>
                                    <View style={styles.barContainer}>
                                        <View style={[styles.bar, { width: `${barWidth}%`, backgroundColor: config.color }]} />
                                    </View>
                                    <Text style={styles.typeCount}>{count}</Text>
                                </View>
                            );
                        })}
                    </View>

                    {/* ── Recent Incidents Feed ── */}
                    <Text style={styles.subSectionTitle}>Recent Incidents</Text>
                    <View style={styles.incidentList}>
                        {MOCK_INCIDENTS.map((incident) => {
                            const typeConfig = INCIDENT_TYPES[incident.type];
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
                                                    <Text style={styles.incidentTitle} numberOfLines={1}>{incident.title}</Text>
                                                </View>
                                                <View style={styles.incidentMeta}>
                                                    <View style={[styles.typeBadge, { backgroundColor: typeConfig.color + '18' }]}>
                                                        <Text style={[styles.typeBadgeText, { color: typeConfig.color }]}>{typeConfig.label}</Text>
                                                    </View>
                                                    <View style={[styles.statusPill, incident.status === 'active' ? styles.statusActive : styles.statusResolved]}>
                                                        <View style={[styles.statusDot, { backgroundColor: incident.status === 'active' ? colors.critical : colors.success }]} />
                                                        <Text style={[styles.statusText, { color: incident.status === 'active' ? colors.critical : colors.success }]}>
                                                            {incident.status === 'active' ? 'Active' : 'Resolved'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Bottom row: location + time */}
                                        <View style={styles.incidentBottomRow}>
                                            <View style={styles.incidentLocationRow}>
                                                <MaterialCommunityIcons name="map-marker-outline" size={14} color="#94A3B8" />
                                                <Text style={styles.incidentLocation} numberOfLines={1}>{incident.location}</Text>
                                            </View>
                                            <Text style={styles.incidentTime}>{incident.timeAgo}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

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
