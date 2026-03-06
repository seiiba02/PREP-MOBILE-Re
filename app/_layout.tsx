import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';
import { AlertProvider } from '../src/contexts/AlertContext';
import { LocationProvider } from '../src/contexts/LocationContext';
import { NetworkProvider } from '../src/contexts/NetworkContext';
import { Platform, View } from 'react-native';
import { NotificationHandler } from '../src/components/NotificationHandler';
import { setupNotificationHandler } from '../src/utils/notifications';
import { OfflineBanner } from '../src/components/common/OfflineBanner';

export default function RootLayout() {
    useEffect(() => {
        // Configure foreground notification display (banner + sound + badge).
        // setupNotificationHandler() includes shouldShowBanner and shouldShowList
        // required by Expo SDK 51+ for pop-up banners while the app is open.
        if (Platform.OS !== 'web') {
            setupNotificationHandler();
        }
    }, []);

    return (
        <NetworkProvider>
            <AuthProvider>
                <LocationProvider>
                    <AlertProvider>
                        <View style={{ flex: 1 }}>
                            <NotificationHandler />
                            <StatusBar style="auto" />
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            </Stack>
                            <OfflineBanner />
                        </View>
                    </AlertProvider>
                </LocationProvider>
            </AuthProvider>
        </NetworkProvider>
    );
}
