import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { User, AuthState } from '../types';
import {
    loginResident,
    registerResident,
    getResidentProfile,
    updateResidentProfile,
    ApiResident,
} from '../services/api';

interface AuthContextType extends AuthState {
    login: (contactNumber: string, password: string) => Promise<void>;
    register: (userData: Partial<User> & { password: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@PREP_AUTH_DATA';

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
    };
    return { user, token };
}

const DEVICE_NAME =
    Platform.OS === 'android' ? 'PREP Android App' : 'PREP iOS App';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isLoading: true,
        isAuthenticated: false,
    });

    // Load stored auth data on mount
    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const storedData = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedData) {
                    const { user, token } = JSON.parse(storedData);
                    setState({ user, token, isLoading: false, isAuthenticated: true });
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
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
            setState({ user, token, isLoading: false, isAuthenticated: true });
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    const register = async (userData: Partial<User> & { password: string }) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            // TODO: collect `email` and `contact_number` in the register form.
            // For now, derive a placeholder email so the backend validates.
            const contactNumber = userData.contactNumber
                ?? userData['contactNumber' as keyof typeof userData] as string
                ?? '';
            const email = contactNumber.includes('@')
                ? contactNumber
                : `${contactNumber.replace(/\D/g, '')}@prep.local`;

            const payload = await registerResident({
                full_name: userData.fullName ?? '',
                email,
                contact_number: contactNumber,
                password: userData.password,
                password_confirmation: userData.password,
                // Backend resolves by name when barangay_id is omitted
                barangay_name: userData.barangay ?? '',
                device_name: DEVICE_NAME,
            });
            const { user, token } = mapApiResident(payload.resident, payload.token);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
            setState({ user, token, isLoading: false, isAuthenticated: true });
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
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
            });
            const { user } = mapApiResident(updated, state.token ?? '');
            const mergedUser = { ...state.user, ...user };
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ user: mergedUser, token: state.token }),
            );
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
