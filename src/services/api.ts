import axios from 'axios';
import { config } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

export async function getVideos(): Promise<ApiVideo[]> {
    const res = await api.get<ApiResponse<ApiVideo[]>>('/videos');
    const body = res.data;
    if (body.success && Array.isArray(body.data)) {
        return body.data;
    }
    // Some wrappers return the array directly
    if (Array.isArray(body)) return body as unknown as ApiVideo[];
    return [];
}

export default api;
