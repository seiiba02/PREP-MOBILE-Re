import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '../types';
import { weatherService } from '../services/weatherService';

export const useWeather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await weatherService.getCurrentWeather();
            setWeather(data);
        } catch (err) {
            setError('Failed to load weather data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWeather();

        // Refresh weather every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchWeather]);

    return { weather, isLoading, error, refreshWeather: fetchWeather };
};

