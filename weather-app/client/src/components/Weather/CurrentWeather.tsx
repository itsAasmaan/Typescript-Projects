import React from 'react';
import { MapPin, Droplets, Wind, Gauge, Eye, Thermometer } from 'lucide-react';
import type { WeatherData, Units } from '../../types/weather';
import { getWeatherIcon } from '../../utils/weatherIcons';

interface CurrentWeatherProps {
  weather: WeatherData;
  units: Units;
  className?: string;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  units,
  className = ''
}) => {
  const temp = units === 'metric' 
    ? (weather.current.temp_c || weather.current.temperature)
    : (weather.current.temp_f || (weather.current.temperature * 9/5) + 32);
    
  const feelsLike = units === 'metric' 
    ? (weather.current.feelslike_c || weather.current.feelsLike)
    : (weather.current.feelslike_f || (weather.current.feelsLike * 9/5) + 32);
    
  const windSpeed = units === 'metric' 
    ? (weather.current.wind_kph || weather.current.windSpeed)
    : (weather.current.wind_mph || weather.current.windSpeed * 0.621371);
    
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'km/h' : 'mph';
  const pressure = weather.current.pressure_mb || weather.current.pressure;
  const visibility = weather.current.vis_km || weather.current.visibility || 10;
  const humidity = weather.current.humidity;

  const weatherStats = [
    {
      icon: <Droplets className="w-4 h-4 text-blue-200" />,
      label: 'Humidity',
      value: `${humidity}%`
    },
    {
      icon: <Wind className="w-4 h-4 text-blue-200" />,
      label: 'Wind',
      value: `${Math.round(windSpeed)} ${windUnit}`
    },
    {
      icon: <Gauge className="w-4 h-4 text-blue-200" />,
      label: 'Pressure',
      value: `${pressure} mb`
    },
    {
      icon: <Eye className="w-4 h-4 text-blue-200" />,
      label: 'Visibility',
      value: `${visibility} km`
    },
    {
      icon: <Thermometer className="w-4 h-4 text-blue-200" />,
      label: 'Feels like',
      value: `${Math.round(feelsLike)}${tempUnit}`
    }
  ];

  const condition = weather.current.condition?.text || 'Clear';
  
  return (
    <div className={`bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{weather.location.name}</h2>
          <div className="flex items-center gap-2 text-blue-100">
            <MapPin className="w-4 h-4" />
            <span>{weather.location.country}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-blue-100">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </div>
          <div className="text-xs text-blue-200">
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full">
            {getWeatherIcon(condition, 48)}
          </div>
          <div>
            <div className="text-4xl font-bold">{Math.round(temp)}{tempUnit}</div>
            <div className="text-blue-100 text-sm">
              Feels like {Math.round(feelsLike)}{tempUnit}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-medium capitalize">
            {condition}
          </div>
          <div className="text-blue-100 text-sm">
            Updated just now
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {weatherStats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-white/20 rounded-xl p-4 backdrop-blur-md shadow-md text-white"
          >
            {stat.icon}
            <div>
              <div className="font-medium text-sm">{stat.value}</div>
              <div className="text-blue-100 text-xs">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};