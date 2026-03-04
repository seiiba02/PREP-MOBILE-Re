import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAlerts } from '../contexts/AlertContext'; // Ensure path is correct
export const SharedHeader = ({ scrollY }: { scrollY?: Animated.Value }) => {
    const router = useRouter();
    // We get the unread count directly from the context so it's always up to date
    const { unreadCount } = useAlerts();
    // Progressive Reveal Animations
    const logoOpacity = scrollY?.interpolate({
        inputRange: [-100, 0, 150],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp'
    }) || 1;
    const logoScale = scrollY?.interpolate({
        inputRange: [-100, 0, 150],
        outputRange: [1.1, 1, 0.8],
        extrapolate: 'clamp'
    }) || 1;
    return (
        <>
            <LinearGradient
                colors={['#FF4D4D', '#1B2560']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.headerBackground}
                pointerEvents="none"
            />
            <View style={styles.headerForeground}>
                <SafeAreaView edges={['top']} style={styles.headerContent}>
                    <View style={styles.headerTopRow} >
                        {/* Logo and CDRRMO */}
                        <View style={styles.logoTitleWrapper} >
                            <Image source={require('../../assets/images/sjlogo1.png')} style={styles.logoIcon} />
                            <Image source={require('../../assets/images/sjlogo2.png')} style={styles.logoIcon} />
                            <Image source={require('../../assets/images/sjlogo3.png')} style={styles.logoIcon} />
                        </View>
                        {/* Notification Button */}
                        <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/alerts')}>
                            <MaterialCommunityIcons name="bell" size={24} color="#FF4D4D" />
                            {unreadCount > 0 && <View style={styles.notificationBadge} />}
                        </TouchableOpacity>
                    </View>

                </SafeAreaView>
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    headerContainer: {
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        height: 220, // Main height of the gradient background
        paddingHorizontal: 20,
        zIndex: 100,
    },
    headerBackground: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 220,
        zIndex: 0,
    },
    headerForeground: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        paddingHorizontal: 20,
        zIndex: 10, // Higher than ScrollView
        elevation: 10, // Essential for Android
    },
    headerContent: {
        marginTop: Platform.OS === 'ios' ? 10 : 30, // Status bar adjustment
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoTitleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'white',
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        // Shadow for the button
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 1,
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF4D4D',
        borderWidth: 1.5,
        borderColor: 'white',
    },
});
