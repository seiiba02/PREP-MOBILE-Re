import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';
import { spacing } from '../../constants/colors';

function AlertCardSkeleton() {
    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.row}>
                    <Skeleton width={16} height={16} borderRadius={8} style={styles.mr6} />
                    <Skeleton width={60} height={10} borderRadius={4} />
                </View>
                <Skeleton width={80} height={10} borderRadius={4} />
            </View>
            <Skeleton width="85%" height={18} borderRadius={4} style={styles.mb6} />
            <Skeleton width="100%" height={11} borderRadius={4} style={styles.mb4} />
            <Skeleton width="70%" height={11} borderRadius={4} />
        </View>
    );
}

export function AlertsSkeleton() {
    return (
        <View style={styles.container}>
            {[0, 1, 2].map((i) => (
                <AlertCardSkeleton key={i} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
    },
    card: {
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mr6: { marginRight: 6 },
    mb4: { marginBottom: 4 },
    mb6: { marginBottom: 6 },
});
