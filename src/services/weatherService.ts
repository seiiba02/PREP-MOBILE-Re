import { WeatherData } from '../types';

/**
 * Service to fetch weather data for San Juan, Metro Manila.
 * In a real application, this would call the OpenWeatherMap API or similar.
 */
export const weatherService = {
    async getCurrentWeather(): Promise<WeatherData> {
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                temperature: 31,
                humidity: 72,
                windSpeed: 12,
                description: 'Partly Cloudy',
                icon: 'weather-partly-cloudy',
                timestamp: new Date().toISOString(),
                high: 34,
                low: 26,
            };
        } catch (error) {
            console.error('Failed to fetch weather:', error);
            throw error;
        }
    }
};
