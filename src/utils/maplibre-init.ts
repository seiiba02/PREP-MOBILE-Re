/**
 * MapLibre GL initialization
 * This file ensures MapLibre is properly loaded before use
 */
import MapLibreGL from '@maplibre/maplibre-react-native';

// MapLibre doesn't require access tokens (it's open-source)
// This initialization ensures the native module is loaded
export function initializeMapLibre() {
    // No operation needed - MapLibre auto-loads native modules
    // This file just ensures the import happens early
}

export { MapLibreGL };
