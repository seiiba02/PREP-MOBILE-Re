import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyAlert, AlertSeverity } from '../types';
import { getAlerts, getRecentAlerts, ApiAlert } from '../services/api';
import { useAuth } from './AuthContext';

const READ_IDS_KEY = '@PREP_READ_ALERTS';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Map backend severity string → mobile AlertSeverity. */
function mapSeverity(severity: string): AlertSeverity {
    switch (severity) {
        case 'critical':
            return 'critical';
        case 'high':
            return 'warning';
        case 'medium':
        case 'low':
            return 'advisory';
        default:
            return 'info';
    }
}

/** Convert an ApiAlert from the backend into the app-wide EmergencyAlert shape. */
function mapAlert(a: ApiAlert, readIds: Set<string>): EmergencyAlert {
    const id = String(a.id);
    return {
        id,
        type: mapSeverity(a.severity),
        title: a.title,
        message: a.message,
        timestamp: a.timestamp,
        isRead: readIds.has(id),
    };
}

async function loadReadIds(): Promise<Set<string>> {
    try {
        const raw = await AsyncStorage.getItem(READ_IDS_KEY);
        return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch {
        return new Set<string>();
    }
}

async function saveReadIds(ids: Set<string>): Promise<void> {
    try {
        await AsyncStorage.setItem(READ_IDS_KEY, JSON.stringify([...ids]));
    } catch (e) {
        console.warn('Failed to persist read alert IDs', e);
    }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface AlertContextType {
    alerts: EmergencyAlert[];
    unreadCount: number;
    isLoading: boolean;
    addAlert: (alert: Omit<EmergencyAlert, 'id' | 'timestamp' | 'isRead'>) => void;
    markAsRead: (alertId: string) => void;
    markAllAsRead: () => void;
    refreshAlerts: () => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const unreadCount = alerts.filter(a => !a.isRead).length;

    // Load persisted read IDs once on mount
    useEffect(() => {
        loadReadIds().then(setReadIds);
    }, []);

    const refreshAlerts = useCallback(async () => {
        setIsLoading(true);
        try {
            const apiAlerts: ApiAlert[] = isAuthenticated
                ? await getAlerts()
                : await getRecentAlerts();

            const currentReadIds = await loadReadIds();
            setReadIds(currentReadIds);
            setAlerts(apiAlerts.map(a => mapAlert(a, currentReadIds)));
        } catch (error) {
            console.error('Failed to fetch alerts:', error);
            // Keep existing alerts on failure so the UI isn't wiped
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    // Fetch alerts on mount and whenever auth status changes
    useEffect(() => {
        refreshAlerts();
    }, [refreshAlerts]);

    const addAlert = (alertData: Omit<EmergencyAlert, 'id' | 'timestamp' | 'isRead'>) => {
        const newAlert: EmergencyAlert = {
            ...alertData,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            isRead: false,
        };
        setAlerts(prev => [newAlert, ...prev]);
    };

    const markAsRead = (alertId: string) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === alertId ? { ...alert, isRead: true } : alert
        ));
        setReadIds(prev => {
            const next = new Set(prev).add(alertId);
            saveReadIds(next);
            return next;
        });
    };

    const markAllAsRead = () => {
        setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
        setReadIds(prev => {
            const next = new Set(prev);
            alerts.forEach(a => next.add(a.id));
            saveReadIds(next);
            return next;
        });
    };

    return (
        <AlertContext.Provider
            value={{
                alerts,
                unreadCount,
                isLoading,
                addAlert,
                markAsRead,
                markAllAsRead,
                refreshAlerts
            }}
        >
            {children}
        </AlertContext.Provider>
    );
};

export const useAlerts = () => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlerts must be used within an AlertProvider');
    }
    return context;
};
