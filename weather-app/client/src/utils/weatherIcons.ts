import React from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  CloudDrizzle,
  Wind,
  CloudFog
} from 'lucide-react';

export const getWeatherIcon = (condition: string, size: number = 24): React.ReactElement => {
  const iconClass = `w-${Math.floor(size/4)} h-${Math.floor(size/4)}`;
  const conditionLower = condition.toLowerCase();
  
  // Rain conditions
  if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    return React.createElement(CloudRain, { className: iconClass });
  }
  
  // Drizzle conditions
  if (conditionLower.includes('drizzle')) {
    return React.createElement(CloudDrizzle, { className: iconClass });
  }
  
  // Snow conditions
  if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
    return React.createElement(CloudSnow, { className: iconClass });
  }
  
  // Thunderstorm conditions
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return React.createElement(CloudLightning, { className: iconClass });
  }
  
  // CloudFog/Mist conditions
  if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haze')) {
    return React.createElement(CloudFog, { className: iconClass });
  }
  
  // Wind conditions
  if (conditionLower.includes('wind')) {
    return React.createElement(Wind, { className: iconClass });
  }
  
  // Cloud conditions
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return React.createElement(Cloud, { className: iconClass });
  }
  
  // Clear/Sunny conditions (default)
  return React.createElement(Sun, { className: iconClass });
};

export const getWeatherIconByCode = (code: number, size: number = 24): React.ReactElement => {
  const iconClass = `w-${Math.floor(size/4)} h-${Math.floor(size/4)}`;
  
  // Weather condition codes mapping (common weather API codes)
  if (code >= 200 && code < 300) {
    // Thunderstorm
    return React.createElement(CloudLightning, { className: iconClass });
  } else if (code >= 300 && code < 400) {
    // Drizzle
    return React.createElement(CloudDrizzle, { className: iconClass });
  } else if (code >= 500 && code < 600) {
    // Rain
    return React.createElement(CloudRain, { className: iconClass });
  } else if (code >= 600 && code < 700) {
    // Snow
    return React.createElement(CloudSnow, { className: iconClass });
  } else if (code >= 700 && code < 800) {
    // Atmosphere (fog, mist, etc.)
    return React.createElement(CloudFog, { className: iconClass });
  } else if (code === 800) {
    // Clear sky
    return React.createElement(Sun, { className: iconClass });
  } else if (code > 800 && code < 900) {
    // Clouds
    return React.createElement(Cloud, { className: iconClass });
  }
  
  // Default to sun
  return React.createElement(Sun, { className: iconClass });
};