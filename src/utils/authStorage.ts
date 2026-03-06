import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';

// expo-secure-store is unavailable on web — lazy-load to avoid crash.
let SecureStore: typeof import('expo-secure-store') | null = null;
if (Platform.OS !== 'web') {
    try {
        SecureStore = require('expo-secure-store');
    } catch {
        SecureStore = null;
    }
}

// ── Keys ──────────────────────────────────────────────────────────────────────

/** Encrypted token stored in SecureStore (or AsyncStorage on web). */
const TOKEN_KEY = 'PREP_AUTH_TOKEN';

/** Non-sensitive user profile stored in AsyncStorage. */
const USER_KEY = '@PREP_USER_PROFILE';

/** Legacy key from the previous implementation (plain-text token + user blob). */
const LEGACY_KEY = '@PREP_AUTH_DATA';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function setSecure(key: string, value: string): Promise<void> {
    if (SecureStore) {
        await SecureStore.setItemAsync(key, value);
    } else {
        await AsyncStorage.setItem(`@SECURE_${key}`, value);
    }
}

async function getSecure(key: string): Promise<string | null> {
    if (SecureStore) {
        return SecureStore.getItemAsync(key);
    }
    return AsyncStorage.getItem(`@SECURE_${key}`);
}

async function deleteSecure(key: string): Promise<void> {
    if (SecureStore) {
        await SecureStore.deleteItemAsync(key);
    } else {
        await AsyncStorage.removeItem(`@SECURE_${key}`);
    }
}

// ── Migration ─────────────────────────────────────────────────────────────────

/**
 * One-time migration: moves the token from the old plain-text blob
 * into SecureStore and the user profile into its own AsyncStorage key.
 * Returns the migrated data or null if there was nothing to migrate.
 */
async function migrateLegacy(): Promise<{ user: User; token: string } | null> {
    try {
        const raw = await AsyncStorage.getItem(LEGACY_KEY);
        if (!raw) return null;

        const { user, token } = JSON.parse(raw) as { user: User; token: string };
        if (!token) return null;

        // Write to new locations
        await setSecure(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

        // Delete legacy key
        await AsyncStorage.removeItem(LEGACY_KEY);

        return { user, token };
    } catch {
        return null;
    }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Persist auth data after login / register / profile update.
 * Token → SecureStore (encrypted), user profile → AsyncStorage.
 */
export async function saveAuthData(user: User, token: string): Promise<void> {
    await setSecure(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Load persisted auth data on app startup.
 * Handles transparent migration from the legacy storage format.
 */
export async function loadAuthData(): Promise<{ user: User; token: string } | null> {
    // Attempt migration from old format first
    const migrated = await migrateLegacy();
    if (migrated) return migrated;

    const [token, userJson] = await Promise.all([
        getSecure(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
    ]);

    if (!token || !userJson) return null;

    try {
        const user = JSON.parse(userJson) as User;
        return { user, token };
    } catch {
        return null;
    }
}

/**
 * Clear all auth data (logout / 401 expiry).
 */
export async function clearAuthData(): Promise<void> {
    await Promise.all([
        deleteSecure(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
        // Also clean up legacy key in case migration didn't run
        AsyncStorage.removeItem(LEGACY_KEY),
    ]);
}

/**
 * Read the auth token only — used by the API request interceptor.
 * Much cheaper than loading + parsing the full auth blob.
 */
export async function getToken(): Promise<string | null> {
    return getSecure(TOKEN_KEY);
}
