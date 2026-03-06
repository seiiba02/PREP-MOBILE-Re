import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { config } from '../constants/config';

interface NetworkContextType {
    isConnected: boolean | null;
}

const NetworkContext = createContext<NetworkContextType>({ isConnected: null });

const CONNECTIVITY_POLL_MS = 100;
const CONNECTIVITY_TIMEOUT_MS = 4000;

async function probeConnectivity(): Promise<boolean> {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
        return navigator.onLine;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONNECTIVITY_TIMEOUT_MS);

    try {
        // API root probe: succeeds when device can reach backend host
        const response = await fetch(config.api.serverUrl, {
            method: 'HEAD',
            cache: 'no-store',
            signal: controller.signal,
        });

        // Any HTTP response means network path exists
        return response.status > 0;
    } catch {
        return false;
    } finally {
        clearTimeout(timeoutId);
    }
}

export function NetworkProvider({ children }: { children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    useEffect(() => {
        let mounted = true;
        let connectivityPoll: ReturnType<typeof setInterval> | undefined;

        const syncState = async () => {
            try {
                const online = await probeConnectivity();
                if (mounted) setIsConnected(online);
            } catch {
                if (mounted) {
                    setIsConnected(false);
                }
            }
        };

        void syncState();

        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const onOnline = () => setIsConnected(true);
            const onOffline = () => setIsConnected(false);
            window.addEventListener('online', onOnline);
            window.addEventListener('offline', onOffline);

            return () => {
                mounted = false;
                if (connectivityPoll) clearInterval(connectivityPoll);
                window.removeEventListener('online', onOnline);
                window.removeEventListener('offline', onOffline);
            };
        }

        connectivityPoll = setInterval(() => {
            void syncState();
        }, CONNECTIVITY_POLL_MS);

        return () => {
            mounted = false;
            if (connectivityPoll) clearInterval(connectivityPoll);
        };
    }, []);

    return (
        <NetworkContext.Provider value={{ isConnected }}>
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetwork(): NetworkContextType {
    return useContext(NetworkContext);
}
