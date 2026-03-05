import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAlerts } from '../contexts/AlertContext';

/**
 * Headless component that wires up Expo notification listeners.
 * Must be rendered inside both <AuthProvider> and <AlertProvider> so it has
 * access to refreshAlerts() and the router.
 *
 * - Foreground arrival  → refreshes the alert feed in-place
 * - User taps push      → navigates to incident tab (incident type)
 *                          or alerts screen (all other types)
 */
export function NotificationHandler() {
    const { refreshAlerts } = useAlerts();
    const router = useRouter();

    useEffect(() => {
        if (Platform.OS === 'web') return;

        let receivedSub: { remove: () => void } | null = null;
        let responseSub: { remove: () => void } | null = null;

        try {
            const Notifications = require('expo-notifications');

            // Foreground: notification arrives while app is open
            receivedSub = Notifications.addNotificationReceivedListener(
                (notification: any) => {
                    const data = notification?.request?.content?.data ?? {};
                    if (data.type === 'incident') {
                        refreshAlerts();
                    }
                }
            );

            // Background/killed: user taps the notification
            responseSub = Notifications.addNotificationResponseReceivedListener(
                (response: any) => {
                    const data = response?.notification?.request?.content?.data ?? {};
                    if (data.type === 'incident') {
                        router.push('/(tabs)/incident');
                    } else {
                        router.push('/alerts');
                    }
                }
            );
        } catch (e) {
            // expo-notifications may not be available in Expo Go / web
            console.log('NotificationHandler: listeners unavailable', e);
        }

        return () => {
            receivedSub?.remove();
            responseSub?.remove();
        };
    }, [refreshAlerts, router]);

    return null;
}
