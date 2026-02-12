/**
 * MapWrapper — Expo Go safe wrapper for MapLibre components.
 *
 * Metro statically bundles every `require()` / `import`, so a try/catch
 * around `require('@maplibre/maplibre-react-native')` does NOT prevent
 * the native module from loading and crashing in Expo Go.
 *
 * Strategy:
 *  1. Detect Expo Go at runtime via Constants.executionEnvironment.
 *  2. If Expo Go → render <MapPlaceholder>.
 *  3. If Dev Build / Standalone → render children (which may contain
 *     MapLibre components imported in a SEPARATE file that is only
 *     ever imported behind this guard).
 */

import React from 'react';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { MapPlaceholder } from '../common/MapPlaceholder';

/**
 * `true` when running inside a development build or standalone app
 * where native modules (MapLibre) are compiled in.
 * `false` when running inside Expo Go.
 */
export const isDevBuild: boolean =
    Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

interface MapWrapperProps {
    children: React.ReactNode;
    fallbackTitle?: string;
    fallbackHeight?: number | string;
    onPlaceholderPress?: () => void;
}

/**
 * Renders `children` only when native modules are available.
 * Shows a polished placeholder in Expo Go.
 */
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
