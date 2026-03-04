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

    // API settings
    // ── Change SERVER_URL to your machine's LAN IP when testing on a
    // ── physical device (e.g. 'http://192.168.1.100').  For Android
    // ── emulators use 'http://10.0.2.2'; for iOS simulators 'http://localhost'.
    api: {
        serverUrl: 'http://10.10.10.32:8000',             // PREP-V2 Laravel base URL — XAMPP Apache on port 80 (no port suffix needed)
        get baseUrl() { return `${this.serverUrl}/api/v1/`; },
        timeout: 15000,
    },

    // App settings
    appName: 'PREP Mobile',
    version: '1.0.0',
};
