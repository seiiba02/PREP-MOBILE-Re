import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';
import { colors } from '../../src/constants/colors';
import { useAlerts } from '../../src/contexts/AlertContext';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';

export default function TabLayout() {
    const { unreadCount } = useAlerts();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: true,
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.iconContainer}>
                            {focused && <View style={styles.activeIndicator} />}
                            <MaterialCommunityIcons
                                name={focused ? "home" : "home-outline"}
                                size={28}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="contacts"
                options={{
                    title: 'Contact',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.iconContainer}>
                            {focused && <View style={styles.activeIndicator} />}
                            <Feather name="phone" size={26} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="incident"
                options={{
                    title: 'Incident',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.iconContainer}>
                            {focused && <View style={styles.activeIndicator} />}
                            <MaterialCommunityIcons
                                name={focused ? "alert-circle" : "alert-circle-outline"}
                                size={28}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="training"
                options={{
                    title: 'Training',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.iconContainer}>
                            {focused && <View style={styles.activeIndicator} />}
                            <MaterialCommunityIcons name="play-circle-outline" size={26} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={styles.iconContainer}>
                            {focused && <View style={styles.activeIndicator} />}
                            <Feather name="user" size={26} color={color} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.surface,
        borderTopWidth: 0,
        height: Platform.OS === 'ios' ? 90 : 70,
        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        paddingTop: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    activeIndicator: {
        position: 'absolute',
        top: -10,
        width: 20,
        height: 3,
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
    mapButtonContainer: {
        position: 'absolute',
        top: -35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 4,
        borderColor: 'white',
    },
});

export const sharedStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    headerGradient: {
        height: 220,
        width: '100%',
        paddingHorizontal: 20,

    },
    headerContent: {
        marginTop: Platform.OS === 'ios' ? 10 : 30,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        zIndex: 10,
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'white',
        zIndex: 10,
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '900',
        fontStyle: 'italic',
        zIndex: 1,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF4D4D',
    },
    mainContent: {
        flex: 1,
        zIndex: 10,
        paddingTop: -10,
    },
    scrollContainer: {
        paddingBottom: 100,
        zIndex: 1,
    },
    whiteContainer: {
        marginTop: 140, // Allows the header to be visible initially
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        minHeight: Dimensions.get('window').height - 140,
        padding: 24,
        zIndex: 20
    },
    greeting: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1B2560',
        marginBottom: 12,
    },
    separator: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginBottom: 16,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1B2560',
        marginBottom: 20,
    },

});
