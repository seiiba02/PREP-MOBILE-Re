import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';
import { spacing } from '../../constants/colors';

export function HomeSkeleton() {
    return (
        <View style={styles.container}>
            {/* Greeting */}
            <Skeleton width="50%" height={20} borderRadius={6} style={styles.mb8} />
            <View style={styles.separator} />

            {/* Section title */}
            <Skeleton width="35%" height={16} borderRadius={6} style={styles.mb16} />

            {/* Evacuation Card */}
            <View style={styles.card}>
                <Skeleton width={36} height={36} borderRadius={18} />
                <View style={styles.evacText}>
                    <Skeleton width="40%" height={10} borderRadius={4} style={styles.mb8} />
                    <Skeleton width="65%" height={14} borderRadius={4} />
                </View>
                <View style={styles.evacRight}>
                    <Skeleton width="60%" height={10} borderRadius={4} style={styles.mb8} />
                    <Skeleton width="40%" height={14} borderRadius={4} />
                </View>
                <Skeleton width={32} height={32} borderRadius={16} style={styles.ml8} />
            </View>

            {/* Map Card */}
            <Skeleton width="100%" height={220} borderRadius={20} style={styles.mb24} />

            {/* Weather Card */}
            <Skeleton width="100%" height={180} borderRadius={20} style={styles.mb24} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 4,
    },
    separator: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 12,
    },
    mb8: { marginBottom: 8 },
    mb16: { marginBottom: 16 },
    mb24: { marginBottom: 24 },
    ml8: { marginLeft: 8 },
    card: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    evacText: {
        flex: 1,
        marginLeft: 12,
    },
    evacRight: {
        alignItems: 'flex-end',
        marginHorizontal: 8,
    },
});
