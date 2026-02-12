/**
 * PREP Mobile Type Definitions
 */

// User context and profile
export interface User {
    id: string;
    fullName: string;
    contactNumber: string;
    barangay: string;
    address: string;
    zipCode: string;
    otp: string;
    createdAt: string;
    avatarUrl?: string;
    role?: 'resident' | 'admin';
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

// Emergency Alerts
export type AlertSeverity = 'critical' | 'warning' | 'advisory' | 'info';

export interface EmergencyAlert {
    id: string;
    type: AlertSeverity;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    expiresAt?: string;
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
    };
}

// Emergency Contacts
export type ContactCategory = 'police' | 'fire' | 'medical' | 'barangay' | 'hotline';

export interface EmergencyContact {
    id: string;
    name: string;
    number: string;
    category: ContactCategory;
    icon: string;
    description?: string;
}

// Weather Monitoring
export interface WeatherData {
    temperature: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    timestamp: string;
    high?: number;
    low?: number;
}

// Educational Resources
export interface VideoResource {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    duration: number; // in seconds
    category: string;
    views?: number;
    createdAt: string;
}

// Map Location
export type LocationType = 'evacuation' | 'hospital' | 'fire_station' | 'police_station' | 'barangay_hall';

export interface MapLocation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    type: LocationType;
    address?: string;
    contactNumber?: string;
}
