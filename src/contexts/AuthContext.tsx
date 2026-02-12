import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
    login: (contactNumber: string, password: string) => Promise<void>;
    register: (userData: Partial<User> & { password: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@PREP_AUTH_DATA';

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
                    setState({
                        user,
                        token,
                        isLoading: false,
                        isAuthenticated: true,
                    });
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
            // Mock login for scaffold
            // In production, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockUser: User = {
                id: '1',
                fullName: 'Juan Dela Cruz',
                contactNumber,
                barangay: 'Addition Hills',
                createdAt: new Date().toISOString(),
            };
            const mockToken = 'mock-jwt-token';

            const authData = { user: mockUser, token: mockToken };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authData));

            setState({
                user: mockUser,
                token: mockToken,
                isLoading: false,
                isAuthenticated: true,
            });
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    const register = async (userData: Partial<User> & { password: string }) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            // Mock registration
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newUser: User = {
                id: Math.random().toString(36).substr(2, 9),
                fullName: userData.fullName || '',
                contactNumber: userData.contactNumber || '',
                barangay: userData.barangay || '',
                createdAt: new Date().toISOString(),
            };
            const mockToken = 'mock-jwt-token';

            const authData = { user: newUser, token: mockToken };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authData));

            setState({
                user: newUser,
                token: mockToken,
                isLoading: false,
                isAuthenticated: true,
            });
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setState({
                user: null,
                token: null,
                isLoading: false,
                isAuthenticated: false,
            });
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const updateUser = async (data: Partial<User>) => {
        if (!state.user) return;

        const updatedUser = { ...state.user, ...data };
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
                user: updatedUser,
                token: state.token
            }));
            setState(prev => ({ ...prev, user: updatedUser }));
        } catch (error) {
            console.error('Failed to update user:', error);
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
