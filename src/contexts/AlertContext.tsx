import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyAlert, AlertSeverity } from '../types';
import { getAlerts, getRecentAlerts, ApiAlert } from '../services/api';
import { useAuth } from './AuthContext';

// Storage keys are per-user; guest uses a fixed suffix.
function readKey(userId: string | undefined) {
    return `@PREP_READ_ALERTS_${userId ?? 'guest'}`;
}
function clearedKey(userId: string | undefined) {
    return `@PREP_CLEARED_ALERTS_${userId ?? 'guest'}`;
}

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

async function loadIdSet(key: string): Promise<Set<string>> {
    try {
        const raw = await AsyncStorage.getItem(key);
        return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch {
        return new Set<string>();
    }
}

async function saveIdSet(key: string, ids: Set<string>): Promise<void> {
    try {
        await AsyncStorage.setItem(key, JSON.stringify([...ids]));
    } catch (e) {
        console.warn(`Failed to persist ${key}`, e);
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
    clearRead: () => void;
    refreshAlerts: () => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated, user, isLoading: authLoading } = useAuth();
    const userId = user?.id;
    const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const [clearedIds, setClearedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    // Keep a ref so callbacks always see the latest userId without re-creating
    const userIdRef = useRef(userId);
    useEffect(() => { userIdRef.current = userId; }, [userId]);

    const unreadCount = alerts.filter(a => !a.isRead).length;

    // Load persisted read & cleared IDs when user changes
    useEffect(() => {
        Promise.all([
            loadIdSet(readKey(userId)),
            loadIdSet(clearedKey(userId)),
        ]).then(([r, c]) => {
            setReadIds(r);
            setClearedIds(c);
        });
    }, [userId]);

    const refreshAlerts = useCallback(async () => {
        // Don't fetch while auth state is still being determined from storage
        if (authLoading) return;
        setIsLoading(true);
        try {
            const apiAlerts: ApiAlert[] = isAuthenticated
                ? await getAlerts()
                : await getRecentAlerts();

            const uid = userIdRef.current;
            const currentReadIds = await loadIdSet(readKey(uid));
            const currentClearedIds = await loadIdSet(clearedKey(uid));

            // Prune stale read IDs that no longer match any fetched alert
            const freshAlertIds = new Set(apiAlerts.map(a => String(a.id)));
            const prunedReadIds = new Set<string>(
                [...currentReadIds].filter(id => freshAlertIds.has(id)),
            );
            if (prunedReadIds.size !== currentReadIds.size) {
                saveIdSet(readKey(uid), prunedReadIds);
            }

            setReadIds(prunedReadIds);
            setClearedIds(currentClearedIds);

            // Filter out cleared alerts, then map
            const visible = apiAlerts.filter(a => !currentClearedIds.has(String(a.id)));
            setAlerts(visible.map(a => mapAlert(a, prunedReadIds)));
        } catch (error) {
            console.error('Failed to fetch alerts:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, authLoading]);

    // Fetch alerts on mount and whenever auth status changes.
    // The guard in refreshAlerts ensures we skip calls while auth is loading.
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
            saveIdSet(readKey(userIdRef.current), next);
            return next;
        });
    };

    const markAllAsRead = () => {
        setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
        setReadIds(prev => {
            const next = new Set(prev);
            alerts.forEach(a => next.add(a.id));
            saveIdSet(readKey(userIdRef.current), next);
            return next;
        });
    };

    const clearRead = () => {
        const readAlertIds = alerts.filter(a => a.isRead).map(a => a.id);
        if (readAlertIds.length === 0) return;

        // Remove from visible list
        setAlerts(prev => prev.filter(a => !a.isRead));

        // Persist cleared IDs so they stay hidden across refreshes / app restarts
        setClearedIds(prev => {
            const next = new Set(prev);
            readAlertIds.forEach(id => next.add(id));
            saveIdSet(clearedKey(userIdRef.current), next);
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
                clearRead,
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
