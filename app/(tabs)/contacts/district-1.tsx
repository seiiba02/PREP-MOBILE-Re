import React from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SharedHeader } from '../../../src/components/SharedHeader';
import { BarangayCard } from '../../../src/components/BarangayCard';
import { sharedStyles } from '../_layout';
import { DISTRICT_1_BARANGAYS } from '../../../src/constants/barangays';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../src/constants/colors';

export default function District1Screen() {
    const router = useRouter();
    return (
        <View style={sharedStyles.container}>
            <SharedHeader />
            <ScrollView
                style={sharedStyles.mainContent}
                contentContainerStyle={sharedStyles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <SharedHeader />
                <View style={sharedStyles.whiteContainer}>
                    <Text style={sharedStyles.greeting}>Hello, {'Sambajunnie Boi'}!</Text>
                    <View style={sharedStyles.separator} />
                    <View style={styles.titleContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.secondary} />
                        </TouchableOpacity>
                        <Text style={[sharedStyles.sectionTitle, { marginBottom: 0 }]}>San Juan District 1</Text>
                    </View>
                    <View style={styles.listContainer}>
                        {DISTRICT_1_BARANGAYS.map((barangay) => (
                            <BarangayCard key={barangay.id} name={barangay.name} logo={barangay.logo} onPress={() => { router.push(`/contacts/${barangay.id}`) }} />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    listContainer: {
        marginTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
