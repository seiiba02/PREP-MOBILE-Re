import React from 'react';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { MapPlaceholder } from '../common/MapPlaceholder';


export const isDevBuild: boolean =
    Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

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
