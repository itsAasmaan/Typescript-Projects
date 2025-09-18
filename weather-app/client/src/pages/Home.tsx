import React, { useState } from 'react';
import { AlertCircle, RefreshCw, MapPin } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import { SearchWeather } from '../components/Weather/SearchWeather';
import { CurrentWeather } from '../components/Weather/CurrentWeather';
import { Forecast } from '../components/Weather/Forecast';
import { Button } from '../components/UI/Button';

export const Home: React.FC = () => {
  const {
    currentWeather,
    forecast,
    loading,
    error,
    units,
    fetchWeatherData,
    fetchWeatherByCoords,
    clearError
  } = useWeather();
  
  const [currentCity, setCurrentCity] = useState('London');

  const handleSearch = (city: string) => {
    setCurrentCity(city);
    fetchWeatherData(city);
  };

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please search for a city manually.');
        }
      );
    }
  };

  const handleRefresh = () => {
    if (currentWeather?.location?.name) {
      fetchWeatherData(currentWeather.location.name);
    } else {
      fetchWeatherData(currentCity);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <SearchWeather
          onSearch={handleSearch}
          onLocationSearch={handleLocationSearch}
          loading={loading}
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>
              {currentWeather?.location?.name
                ? `Current: ${currentWeather.location.name}, ${currentWeather.location.country}`
                : 'Search for a city to get started'
              }
            </span>
          </div>
          
          {currentWeather && (
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              loading={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading weather data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-800 font-medium mb-1">
                Unable to load weather data
              </h3>
              <p className="text-red-700 text-sm mb-3">
                {error}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSearch(currentCity)}
                  variant="outline"
                  size="sm"
                >
                  Try Again
                </Button>
                <Button
                  onClick={clearError}
                  variant="ghost"
                  size="sm"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentWeather && !loading && (
        <div className="space-y-6">
          <CurrentWeather weather={currentWeather} units={units} />
          {forecast && (
            <Forecast forecast={forecast} units={units} />
          )}
        </div>
      )}

      {!currentWeather && !loading && !error && (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to WeatherApp
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get real-time weather information and 5-day forecasts for any location around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleLocationSearch}
                variant="primary"
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Use My Location
              </Button>
              <Button
                onClick={() => handleSearch('London')}
                variant="outline"
              >
                View London Weather
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};