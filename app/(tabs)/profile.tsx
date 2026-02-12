import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../src/constants/colors';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [locationEnabled, setLocationEnabled] = React.useState(true);

    const ProfileItem = ({ icon, title, value, onPress, isDestructive = false }: any) => (
        <TouchableOpacity
            style={styles.profileItem}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={[styles.itemIcon, isDestructive && styles.destructiveIcon]}>
                <MaterialCommunityIcons name={icon} size={22} color={isDestructive ? colors.critical : colors.secondary} />
            </View>
            <View style={styles.itemContent}>
                <Text style={[styles.itemTitle, isDestructive && styles.destructiveText]}>{title}</Text>
                {value && <Text style={styles.itemValue}>{value}</Text>}
            </View>
            {onPress && <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitials}>
                                {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'R'}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <MaterialCommunityIcons name="camera" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user?.fullName || 'Resident'}</Text>
                    <Text style={styles.userBarangay}>Barangay {user?.barangay || 'Not Set'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    <View style={styles.sectionCard}>
                        <ProfileItem icon="phone" title="Contact Number" value={user?.contactNumber} />
                        <ProfileItem icon="map-marker" title="Home Barangay" value={user?.barangay} />
                        <ProfileItem icon="calendar" title="Member Since" value={new Date(user?.createdAt || Date.now()).toLocaleDateString()} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Settings</Text>
                    <View style={styles.sectionCard}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <View style={styles.itemIcon}>
                                    <MaterialCommunityIcons name="bell-outline" size={22} color={colors.secondary} />
                                </View>
                                <Text style={styles.itemTitle}>Push Notifications</Text>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: colors.border, true: colors.secondary + '80' }}
                                thumbColor={notificationsEnabled ? colors.secondary : '#f4f3f4'}
                            />
                        </View>
                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <View style={styles.itemIcon}>
                                    <MaterialCommunityIcons name="crosshairs-gps" size={22} color={colors.secondary} />
                                </View>
                                <Text style={styles.itemTitle}>Location Services</Text>
                            </View>
                            <Switch
                                value={locationEnabled}
                                onValueChange={setLocationEnabled}
                                trackColor={{ false: colors.border, true: colors.secondary + '80' }}
                                thumbColor={locationEnabled ? colors.secondary : '#f4f3f4'}
                            />
                        </View>
                        <ProfileItem icon="logout-variant" title="Log Out" onPress={() => router.replace('/(auth)/login')} isDestructive={true} />
                    </View>
                </View>
                <Text style={styles.versionText}>PREP Mobile v1.0.0 (Production Build)</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: spacing.lg,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
        elevation: 4,
    },
    avatarInitials: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    userBarangay: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 4,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 4,
    },
    sectionCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    itemIcon: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    destructiveIcon: {
        backgroundColor: colors.critical + '15',
        borderRadius: 8,
        width: 36,
        height: 36,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    destructiveText: {
        color: colors.critical,
    },
    itemValue: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: spacing.md,
        opacity: 0.6,
    },
});
