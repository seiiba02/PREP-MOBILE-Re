export const config = {
    // Map configuration for San Juan, Metro Manila
    map: {
        initialRegion: {
            latitude: 14.6019,
            longitude: 121.0355,
            latitudeDelta: 0.0222,
            longitudeDelta: 0.0221,
        },
        zoomLevel: {
            min: 10,
            max: 18,
            default: 14,
        },
    },

    // MapLibre configuration (open-source)
    maplibre: {
        // OpenFreeMap — free, no API key required
        styleUrl: 'https://tiles.openfreemap.org/styles/liberty',
        // Center of San Juan City [lng, lat] — MapLibre uses [lng, lat] order
        center: [121.0355, 14.6019] as [number, number],
        zoom: 13.5,
        previewZoom: 12.8,
        minZoom: 10,
        maxZoom: 18,
    },

    // API settings (Placeholders)
    api: {
        baseUrl: 'https://api.prep-mobile.ph/v1',
        timeout: 10000,
    },

    // App settings
    appName: 'PREP Mobile',
    version: '1.0.0',
};
