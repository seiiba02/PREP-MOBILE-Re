import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Linking, Platform } from 'react-native';
// Type-only import — erased at compile time, zero runtime cost.
// Safe to reference even when the native module is absent.
import type * as ExpoLocation from 'expo-location';

// Runtime lazy require — wrapped in try/catch so this hook can be imported in
// Expo Go (which lacks native modules) without crashing the app.
let Location: typeof ExpoLocation | null = null;
try {
    Location = require('expo-location');
} catch {
    Location = null;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LocationState {
    /** Current GPS coordinates as [longitude, latitude] (MapLibre order) */
    coordinates: [number, number] | null;
    heading: number | null;
    accuracy: number | null;
    error: string | null;
    isLoading: boolean;
    /** null when native modules are unavailable (Expo Go / web) */
    permissionStatus: ExpoLocation.PermissionStatus | null;
}

const UNAVAILABLE_STATE: LocationState = {
    coordinates: null,
    heading: null,
    accuracy: null,
    error: null,
    isLoading: false,
    permissionStatus: null,
};

/**
 * Manages foreground location permission and continuous GPS tracking.
 *
 * - Returns `[lng, lat]` coordinates compatible with MapLibre's coordinate order.
 * - Gracefully handles denied / restricted permissions with an OS Settings prompt.
 * - Safe to import in Expo Go: returns a static empty state when native modules
 *   are unavailable (avoids the "Cannot find native module 'ExpoLocation'" crash).
 *
 * @param enabled  Whether to start tracking. Default: `true`.
 */
export function useLocation(enabled = true): LocationState {
    const [state, setState] = useState<LocationState>(
        Location ? { ...UNAVAILABLE_STATE, isLoading: enabled } : UNAVAILABLE_STATE,
    );
    const subscriptionRef = useRef<ExpoLocation.LocationSubscription | null>(null);

    // ── Permission request with Settings prompt ───────────────────────────
    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!Location) return false;
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setState((prev) => ({ ...prev, permissionStatus: status }));

            if (status !== Location.PermissionStatus.GRANTED) {
                const message =
                    status === Location.PermissionStatus.DENIED
                        ? 'Location access was denied. Enable it in Settings to use routing.'
                        : 'Location access is restricted on this device.';

                setState((prev) => ({ ...prev, error: message, isLoading: false }));

                Alert.alert('Location Required', message, [
                    { text: 'Cancel', style: 'cancel' },
                    ...(Platform.OS === 'ios'
                        ? [{ text: 'Open Settings', onPress: () => Linking.openURL('app-settings:') }]
                        : [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]),
                ]);
                return false;
            }
            return true;
        } catch {
            setState((prev) => ({
                ...prev,
                error: 'Failed to request location permissions.',
                isLoading: false,
            }));
            return false;
        }
    }, []);

    // ── Start watching ────────────────────────────────────────────────────
    const startWatching = useCallback(async () => {
        if (!Location) return; // no-op in Expo Go / web

        const granted = await requestPermission();
        if (!granted) return;

        try {
            // Immediate first fix for a fast initial position
            const initial = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setState((prev) => ({
                ...prev,
                coordinates: [initial.coords.longitude, initial.coords.latitude],
                accuracy: initial.coords.accuracy,
                heading: initial.coords.heading,
                error: null,
                isLoading: false,
            }));

            // Continuous updates — 10 m threshold prevents GPS jitter spam
            subscriptionRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 10,
                    timeInterval: 5000,
                },
                (loc) => {
                    setState((prev) => ({
                        ...prev,
                        coordinates: [loc.coords.longitude, loc.coords.latitude],
                        accuracy: loc.coords.accuracy,
                        heading: loc.coords.heading,
                        error: null,
                    }));
                },
            );
        } catch (e: any) {
            setState((prev) => ({
                ...prev,
                error: e.message || 'Unable to determine your location.',
                isLoading: false,
            }));
        }
    }, [requestPermission]);

    // ── Lifecycle ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (enabled && Location) {
            startWatching();
        }
        return () => {
            subscriptionRef.current?.remove();
            subscriptionRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    return state;
}
