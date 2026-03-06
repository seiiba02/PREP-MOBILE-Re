import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkContextType {
    isConnected: boolean | null;
}

const NetworkContext = createContext<NetworkContextType>({ isConnected: null });

export function NetworkProvider({ children }: { children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    useEffect(() => {
        // Get initial state
        NetInfo.fetch().then((state: NetInfoState) => {
            setIsConnected(state.isConnected);
        });

        // Subscribe to changes
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            setIsConnected(state.isConnected);
        });

        return unsubscribe;
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
