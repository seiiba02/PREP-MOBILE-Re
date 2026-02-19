import React from 'react';
import { MapPlaceholder } from '../common/MapPlaceholder';

// Safely detect if we're in a development build (not Expo Go)
let isDevBuild = false;
try {
    const Constants = require('expo-constants').default;
    const ExecutionEnvironment = require('expo-constants').ExecutionEnvironment;
    if (Constants && ExecutionEnvironment) {
        isDevBuild = Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;
    }
} catch {
    isDevBuild = false;
}
export { isDevBuild };

interface MapWrapperProps {
    children: React.ReactNode;
    fallbackTitle?: string;
    fallbackHeight?: number | string;
    onPlaceholderPress?: () => void;
}

export function MapWrapper({
    children,
    fallbackTitle,
    fallbackHeight,
    onPlaceholderPress,
}: MapWrapperProps) {
    if (!isDevBuild) {
        return (
            <MapPlaceholder
                title={fallbackTitle}
                height={fallbackHeight}
                onPress={onPlaceholderPress}
            />
        );
    }

    return <>{children}</>;
}
