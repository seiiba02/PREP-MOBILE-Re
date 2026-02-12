import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EmergencyAlert } from '../types';

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
    const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const unreadCount = alerts.filter(a => !a.isRead).length;

    const refreshAlerts = async () => {
        setIsLoading(true);
        try {
            // Mock alert fetching
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 800));

            const mockAlerts: EmergencyAlert[] = [
                {
                    id: '1',
                    type: 'critical',
                    title: 'Flood Warning',
                    message: 'Water levels in San Juan River are rising. Residents in low-lying areas should prepare for evacuation.',
                    timestamp: new Date().toISOString(),
                    isRead: false,
                },
                {
                    id: '2',
                    type: 'warning',
                    title: 'Thunderstorm Advisory',
                    message: 'Moderate to heavy rain with lightning and strong winds expected in Metro Manila within the next 2 hours.',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    isRead: true,
                },
                {
                    id: '3',
                    type: 'info',
                    title: 'Community Drill',
                    message: 'Barangay Addition Hills will conduct an earthquake drill tomorrow at 9:00 AM. Please participate.',
                    timestamp: new Date(Date.now() - 86400000).toISOString(),
                    isRead: true,
                }
            ];

            setAlerts(mockAlerts);
        } catch (error) {
            console.error('Failed to fetch alerts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshAlerts();
    }, []);

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
    };

    const markAllAsRead = () => {
        setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
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
