import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';
import { spacing } from '../../constants/colors';

function IncidentCardSkeleton() {
    return (
        <View style={styles.incidentCard}>
            <Skeleton width={40} height={40} borderRadius={10} style={styles.mr12} />
            <View style={styles.incidentBody}>
                <Skeleton width="60%" height={14} borderRadius={4} style={styles.mb6} />
                <Skeleton width="35%" height={10} borderRadius={4} style={styles.mb10} />
                <View style={styles.row}>
                    <Skeleton width={12} height={12} borderRadius={6} style={styles.mr4} />
                    <Skeleton width="50%" height={10} borderRadius={4} />
                </View>
            </View>
            <Skeleton width="20%" height={10} borderRadius={4} />
        </View>
    );
}

export function IncidentSkeleton() {
    return (
        <View>
            {/* Location banner */}
            <Skeleton width="100%" height={56} borderRadius={16} style={styles.mb16} />

            {/* Today Summary Card */}
            <View style={styles.summaryCard}>
                <View style={styles.row}>
                    <Skeleton width={50} height={20} borderRadius={10} style={styles.mr8} />
                    <Skeleton width="40%" height={16} borderRadius={4} />
                </View>
                <Skeleton width={48} height={42} borderRadius={6} style={styles.mt12} />
                <Skeleton width="35%" height={11} borderRadius={4} style={styles.mt6} />
            </View>

            {/* Type breakdown */}
            <Skeleton width="40%" height={14} borderRadius={4} style={styles.mb12} />
            <View style={styles.typeCard}>
                {[0, 1, 2].map((i) => (
                    <View key={i} style={[styles.typeRow, i < 2 && styles.mb12]}>
                        <Skeleton width={28} height={28} borderRadius={8} style={styles.mr8} />
                        <Skeleton width="40%" height={12} borderRadius={4} style={styles.mr8} />
                        <View style={styles.flex}>
                            <Skeleton width={`${75 - i * 20}%`} height={8} borderRadius={4} />
                        </View>
                        <Skeleton width={18} height={12} borderRadius={4} style={styles.ml8} />
                    </View>
                ))}
            </View>

            {/* Recent Incidents */}
            <Skeleton width="40%" height={14} borderRadius={4} style={styles.mb12} />
            <View style={styles.incidentList}>
                {[0, 1, 2].map((i) => (
                    <IncidentCardSkeleton key={i} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mb6: { marginBottom: 6 },
    mb10: { marginBottom: 10 },
    mb12: { marginBottom: 12 },
    mb16: { marginBottom: 16 },
    mt6: { marginTop: 6 },
    mt12: { marginTop: 12 },
    mr4: { marginRight: 4 },
    mr8: { marginRight: 8 },
    mr12: { marginRight: 12 },
    ml8: { marginLeft: 8 },
    row: { flexDirection: 'row', alignItems: 'center' },
    flex: { flex: 1 },
    summaryCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    typeCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    typeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    incidentList: {
        gap: 10,
    },
    incidentCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    incidentBody: {
        flex: 1,
    },
});
