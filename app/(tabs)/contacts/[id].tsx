import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Platform, Linking, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SharedHeader } from '../../../src/components/SharedHeader';
import { DISTRICT_1_BARANGAYS, DISTRICT_2_BARANGAYS } from '../../../src/constants/barangays';
import { sharedStyles } from '../_layout';
import { colors } from '../../../src/constants/colors';

const { width } = Dimensions.get('window');

interface InfoRowProps {
    icon: any;
    label: string;
    value: string;
    actionLabel?: string;
    onAction?: () => void;
}

const InfoRow = ({ icon, label, value, actionLabel, onAction }: InfoRowProps) => (
    <View style={styles.infoRow}>
        <View style={styles.iconBg}>
            <MaterialCommunityIcons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.rowTextContent}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
        </View>
        {actionLabel && (
            <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
                <Text style={styles.actionText}>{actionLabel}</Text>
            </TouchableOpacity>
        )}
    </View>
);

const OfficialCard = ({ icon, label, name }: { icon: any, label: string, name: string }) => (
    <View style={styles.officialCard}>
        <View style={styles.officialIconWrapper}>
            <Ionicons name={icon} size={24} color="white" />
        </View>
        <View>
            <Text style={styles.officialLabel}>{label}</Text>
            <Text style={styles.officialName}>{name}</Text>
        </View>
    </View>
);

export default function BarangayDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const allBarangays = [...DISTRICT_1_BARANGAYS, ...DISTRICT_2_BARANGAYS];
    const barangay = allBarangays.find(b => b.id === id);

    if (!barangay) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Barangay data not found.</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Return</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleCall = () => Linking.openURL(`tel:${barangay.phone}`);
    const handleEmail = () => Linking.openURL(`mailto:${barangay.email}`);

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
                    {/* Seal & Hero Section */}
                    <View style={styles.heroSection}>
                        <LinearGradient
                            colors={['rgba(255, 77, 77, 0.1)', 'rgba(27, 37, 96, 0.1)']}
                            style={styles.sealGlow}
                        />
                        <View style={styles.sealOutline}>
                            <Image source={barangay.logo} style={styles.largeSeal} />
                        </View>
                        <Text style={styles.title}>BARANGAY {barangay.name}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>SAN JUAN CITY</Text>
                        </View>
                    </View>

                    <View style={sharedStyles.separator} />

                    {/* Officials Section */}
                    <Text style={styles.sectionHeader}>Barangay Officials</Text>
                    <View style={styles.officialsGrid}>
                        <OfficialCard icon="person" label="Punong Barangay" name={barangay.punongBarangay} />
                        <OfficialCard icon="people" label="SK Chairman" name={barangay.skChairman} />
                    </View>

                    {/* Contact & Location Section */}
                    <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Contact Details</Text>
                    <View style={styles.contactContainer}>
                        <InfoRow
                            icon="map-marker"
                            label="Office Address"
                            value={barangay.address}
                        />
                        <InfoRow
                            icon="phone"
                            label="Emergency Number"
                            value={barangay.phone}
                            actionLabel="Call"
                            onAction={handleCall}
                        />
                        <InfoRow
                            icon="email-outline"
                            label="Email Address"
                            value={barangay.email}
                            actionLabel="Email"
                            onAction={handleEmail}
                        />
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
                        <Text style={styles.primaryBtnText}>Back to Directory</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    heroSection: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: -10,
    },
    sealGlow: {
        position: 'absolute',
        top: -20,
        width: width * 0.8,
        height: 200,
        borderRadius: 100,
        opacity: 0.5,
    },
    sealOutline: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'white',
        padding: 4,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        marginBottom: 16,
    },
    largeSeal: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: colors.secondary,
        textAlign: 'center',
        marginBottom: 8,
    },
    badge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#64748B',
        letterSpacing: 1,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.secondary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    officialsGrid: {
        gap: 12,
    },
    officialCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    officialIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    officialLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 2,
    },
    officialName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    contactContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    iconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(27, 37, 96, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    rowTextContent: {
        flex: 1,
    },
    rowLabel: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 1,
    },
    rowValue: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '700',
    },
    actionBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 77, 77, 0.1)',
    },
    actionText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
    },
    primaryBtn: {
        marginTop: 32,
        height: 56,
        backgroundColor: colors.primary,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 20,
    },
    backButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: colors.primary,
        borderRadius: 12,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

