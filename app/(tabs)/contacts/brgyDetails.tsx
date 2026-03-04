import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../src/constants/colors';

export default function BrgyDetailsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.secondary} />
                </TouchableOpacity>
                <Text style={styles.title}>Barangay Details</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.placeholder}>Barangay details coming soon.</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backBtn: { marginRight: 12 },
    title: { fontSize: 18, fontWeight: '700', color: colors.secondary },
    body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    placeholder: { fontSize: 14, color: '#94A3B8' },
});
