import axios from 'axios';
import { config } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

/**
 * Resolve a media URL returned by the backend.
 *
 * The PREP-V2 Laravel API generates absolute URLs using its APP_URL
 * (often http://localhost).  On a mobile device "localhost" points to
 * the phone itself, so we replace the host portion with the configured
 * serverUrl so images / videos are reachable.
 */
function resolveMediaUrl(url: string | null): string | null {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        const server = new URL(config.api.serverUrl);
        // Only rewrite when the backend URL points to localhost / 127.0.0.1
        if (
            parsed.hostname === 'localhost' ||
            parsed.hostname === '127.0.0.1'
        ) {
            parsed.hostname = server.hostname;
            parsed.port = server.port;
            parsed.protocol = server.protocol;
        }
        return parsed.toString();
    } catch {
        // If parsing fails, return the original URL as-is
        return url;
    }
}

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    async (config_axios) => {
        try {
            const storedData = await AsyncStorage.getItem('@PREP_AUTH_DATA');
            if (storedData) {
                const { token } = JSON.parse(storedData);
                if (token && config_axios.headers) {
                    config_axios.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (e) {
            console.error('Error fetching token for API', e);
        }
        return config_axios;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized (session expired)
            // Potentially trigger a logout or token refresh
        }
        return Promise.reject(error);
    }
);

// ── Video Resources ───────────────────────────────────────────────────────────

export interface ApiVideo {
    id: number;
    title: string;
    description: string | null;
    filename: string | null;
    thumbnail: string | null;
    duration_seconds: number | null;
    duration_formatted: string | null;
    category: string | null;
    is_active: boolean;
    video_url: string | null;
    thumbnail_url: string | null;
    created_at: string | null;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

/**
 * Normalise an ApiVideo so that video_url and thumbnail_url point to the
 * correct server address (handles localhost → LAN-IP rewriting).
 */
function normaliseVideoUrls(video: ApiVideo): ApiVideo {
    return {
        ...video,
        video_url: resolveMediaUrl(video.video_url),
        thumbnail_url: resolveMediaUrl(video.thumbnail_url),
    };
}

/**
 * Fetch all active training videos from the PREP-V2 backend.
 */
export async function getVideos(): Promise<ApiVideo[]> {
    const res = await api.get<ApiResponse<ApiVideo[]>>('videos');
    const body = res.data;

    let videos: ApiVideo[] = [];

    if (body.success && Array.isArray(body.data)) {
        videos = body.data;
    } else if (Array.isArray(body)) {
        // Some wrappers return the array directly
        videos = body as unknown as ApiVideo[];
    }

    return videos.map(normaliseVideoUrls);
}

/**
 * Fetch a single video by its ID.
 * Falls back to fetching all and filtering when a dedicated endpoint
 * is not available.
 */
export async function getVideoById(id: number | string): Promise<ApiVideo | null> {
    // The public list endpoint already exists; filter client-side.
    const videos = await getVideos();
    return videos.find((v) => String(v.id) === String(id)) ?? null;
}

export default api;
