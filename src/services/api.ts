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
    async (error) => {
        if (error.response?.status === 401) {
            // Session expired or invalid token — clear stored auth
            try {
                await AsyncStorage.removeItem('@PREP_AUTH_DATA');
            } catch (_) { /* best-effort */ }
        }
        return Promise.reject(error);
    }
);

/**
 * Extract a human-readable error message from an Axios error.
 * Handles Laravel validation (422) and custom API error envelope.
 */
export function extractApiError(error: unknown): string {
    if (!axios.isAxiosError(error)) return 'An unexpected error occurred.';
    const data = error.response?.data;
    if (!data) {
        if (error.code === 'ECONNABORTED') return 'Request timed out. Check your connection.';
        if (error.message?.includes('Network Error')) return 'Cannot reach the server. Check your connection.';
        return error.message || 'Network error.';
    }
    // Laravel validation: { message: string, errors: Record<string, string[]> }
    if (error.response?.status === 422 && data.errors) {
        const firstField = Object.keys(data.errors)[0];
        return data.errors[firstField]?.[0] ?? data.message ?? 'Validation failed.';
    }
    // Custom API error envelope: { success: false, error: { message } }
    if (data.error?.message) return data.error.message;
    if (data.message) return data.message;
    return 'Something went wrong.';
}

// ── Resident Authentication ──────────────────────────────────────────────────

export interface ApiBarangay {
    id: number | null;
    name: string | null;
}

export interface ApiResident {
    id: number;
    full_name: string;
    contact_number: string | null;
    barangay: ApiBarangay | null;
    settings: {
        notifications_enabled: boolean;
    };
    created_at: string | null;
}

interface LoginPayload {
    identifier: string;
    password: string;
    device_name: string;
}

interface RegisterPayload {
    full_name: string;
    contact_number: string;
    password: string;
    password_confirmation: string;
    barangay_name?: string;
    barangay_id?: number;
    device_name: string;
}

interface AuthResponse {
    resident: ApiResident;
    token: string;
}

/**
 * Login a resident via contact number.
 */
export async function loginResident(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('auth/residents/login', {
        contact_number: payload.identifier,
        password: payload.password,
        device_name: payload.device_name,
    });
    return res.data.data;
}

/**
 * Register a new resident account.
 */
export async function registerResident(payload: RegisterPayload): Promise<AuthResponse> {
    const body: Record<string, unknown> = {
        full_name: payload.full_name,
        contact_number: payload.contact_number,
        password: payload.password,
        password_confirmation: payload.password_confirmation,
        device_name: payload.device_name,
    };
    if (payload.barangay_id) body.barangay_id = payload.barangay_id;
    if (payload.barangay_name) body.barangay_name = payload.barangay_name;

    const res = await api.post<ApiResponse<AuthResponse>>('auth/residents/register', body);
    return res.data.data;
}

/**
 * Fetch the authenticated resident's profile.
 */
export async function getResidentProfile(): Promise<ApiResident> {
    const res = await api.get<ApiResponse<ApiResident>>('residents/profile');
    return res.data.data;
}

/**
 * Update the authenticated resident's profile.
 */
export async function updateResidentProfile(
    data: Partial<{
        full_name: string;
        contact_number: string;
        barangay_id: number;
        notification_enabled: boolean;
    }>,
): Promise<ApiResident> {
    const res = await api.put<ApiResponse<ApiResident>>('residents/profile', data);
    return res.data.data;
}

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
