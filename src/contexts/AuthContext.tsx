import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { User, AuthState } from '../types';
import {
    loginResident,
    registerResident,
    getResidentProfile,
    updateResidentProfile,
    registerDeviceToken,
    logoutResident,
    ApiResident,
} from '../services/api';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { saveAuthData, loadAuthData, clearAuthData } from '../utils/authStorage';

interface AuthContextType extends AuthState {
    login: (contactNumber: string, password: string) => Promise<void>;
    register: (userData: Partial<User> & { password: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Map the backend resident shape → the app-wide User shape. */
function mapApiResident(r: ApiResident, token: string): { user: User; token: string } {
    const user: User = {
        id: String(r.id),
        fullName: r.full_name,
        contactNumber: r.contact_number ?? '',
        barangay: r.barangay?.name ?? '',
        address: '',
        zipCode: '',
        otp: '',
        createdAt: r.created_at ?? new Date().toISOString(),
        role: 'resident',
        notificationsEnabled: r.settings?.notifications_enabled ?? true,
        locationEnabled: r.settings?.location_enabled ?? true,
    };
    return { user, token };
}

const DEVICE_NAME =
    Platform.OS === 'android' ? 'PREP Android App' : 'PREP iOS App';

/** Fire-and-forget: register the Expo push token with the backend. */
async function syncPushToken() {
    try {
        const token = await registerForPushNotificationsAsync();
        if (token) await registerDeviceToken(token);
    } catch (e) {
        console.warn('Push token registration failed (non-blocking):', e);
    }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isLoading: true,
        isAuthenticated: false,
    });

    // Load stored auth data on mount (migrates legacy plain-text storage automatically)
    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const authData = await loadAuthData();
                if (authData) {
                    setState({ user: authData.user, token: authData.token, isLoading: false, isAuthenticated: true });
                    syncPushToken();
                } else {
                    setState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                console.error('Failed to load auth data:', error);
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };
        loadStoredData();
    }, []);

    const login = async (contactNumber: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const payload = await loginResident({
                identifier: contactNumber,
                password,
                device_name: DEVICE_NAME,
            });
            const { user, token } = mapApiResident(payload.resident, payload.token);
            await saveAuthData(user, token);
            setState({ user, token, isLoading: false, isAuthenticated: true });
            syncPushToken();
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    const register = async (userData: Partial<User> & { password: string }) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const contactNumber = userData.contactNumber ?? '';

            const payload = await registerResident({
                full_name: userData.fullName ?? '',
                contact_number: contactNumber,
                password: userData.password,
                password_confirmation: userData.password,
                barangay_name: userData.barangay ?? '',
                device_name: DEVICE_NAME,
            });
            const { user, token } = mapApiResident(payload.resident, payload.token);
            await saveAuthData(user, token);
            setState({ user, token, isLoading: false, isAuthenticated: true });
            syncPushToken();
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    const logout = async () => {
        // Best-effort: tell the backend to clear the device token and revoke
        // the Sanctum token. Wrapped in try/catch so offline logout still works.
        try {
            await logoutResident();
        } catch (error) {
            console.warn('Backend logout failed (non-blocking):', error);
        }

        try {
            await clearAuthData();
        } catch (error) {
            console.error('Failed to clear auth storage:', error);
        } finally {
            setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
        }
    };

    const updateUser = async (data: Partial<User>) => {
        if (!state.user) return;
        try {
            const updated = await updateResidentProfile({
                full_name: data.fullName,
                contact_number: data.contactNumber,
                ...(data.notificationsEnabled !== undefined && { notification_enabled: data.notificationsEnabled }),
                ...(data.locationEnabled !== undefined && { location_enabled: data.locationEnabled }),
            });
            const { user } = mapApiResident(updated, state.token ?? '');
            const mergedUser = { ...state.user, ...user };
            await saveAuthData(mergedUser, state.token ?? '');
            setState(prev => ({ ...prev, user: mergedUser }));
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
