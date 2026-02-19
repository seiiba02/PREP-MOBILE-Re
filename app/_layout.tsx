import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';
import { AlertProvider } from '../src/contexts/AlertContext';
import { Platform } from 'react-native';

export default function RootLayout() {
    useEffect(() => {
        async function setupNotifications() {
            if (Platform.OS === 'web') return;
            try {
                const Notifications = require('expo-notifications');

                Notifications.setNotificationHandler({
                    handleNotification: async () => ({
                        shouldShowAlert: true,
                        shouldPlaySound: true,
                        shouldSetBadge: true,
                    }),
                });

                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    console.log('Failed to get push token for push notification!');
                }
            } catch (e) {
                console.log('Notifications not available (Expo Go):', e);
            }
        }
        setupNotifications();
    }, []);

    return (
        <AuthProvider>
            <AlertProvider>
                <StatusBar style="auto" />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </AlertProvider>
        </AuthProvider>
    );
}
