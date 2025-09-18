import { useState, useEffect } from "react";
import type { WeatherData, ForecastData, Units } from "../types/weather";
import { weatherApi } from "../api/weatherApi";

interface UseWeatherReturn {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  loading: boolean;
  error: string | null;
  units: Units;
  setUnits: (units: Units) => void;
  fetchWeatherData: (city: string) => Promise<void>;
  fetchWeatherByCoords: (lat: number, lon: number) => Promise<void>;
  clearError: () => void;
}

export const useWeather = (
  initialCity: string = "London"
): UseWeatherReturn => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<Units>("metric");

  const clearError = () => setError(null);

  const fetchWeatherData = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const [currentData, forecastData] = await Promise.all([
        weatherApi.getCurrentWeather(city, units),
        weatherApi.getForecast(city, 5, units),
      ]);

      setCurrentWeather(currentData);
      setForecast(forecastData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching weather data";
      setError(errorMessage);
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const currentData = await weatherApi.getCurrentWeatherByCoords(
        lat,
        lon,
        units
      );
      setCurrentWeather(currentData);

      // Fetch forecast using the city name from current weather
      if (currentData.location.name) {
        const forecastData = await weatherApi.getForecast(
          currentData.location.name,
          5,
          units
        );
        setForecast(forecastData);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching weather data";
      setError(errorMessage);
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch data when units change
  useEffect(() => {
    if (currentWeather) {
      fetchWeatherData(currentWeather.location.name);
    } else {
      // fetchWeatherData(initialCity);
    }
  }, [units]);

  // Initial load
  useEffect(() => {
    // fetchWeatherData(initialCity);
  }, []);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    units,
    setUnits,
    fetchWeatherData,
    fetchWeatherByCoords,
    clearError,
  };
};
