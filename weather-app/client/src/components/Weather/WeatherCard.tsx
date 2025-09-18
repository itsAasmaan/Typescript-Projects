import React from "react";
import type { ForecastData, Units } from "../../types/weather";
import { getWeatherIcon } from "../../utils/weatherIcons";
import { getRelativeDay } from "../../utils/formatDate";

interface WeatherCardProps {
  day: ForecastData["forecast"]["forecastday"][0];
  units: Units;
  isToday?: boolean;
  onClick?: () => void;
  className?: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  day,
  units,
  isToday = false,
  onClick,
  className = "",
}) => {
  const maxTemp = units === "metric" ? day.day.maxtemp_c : day.day.maxtemp_f;
  const minTemp = units === "metric" ? day.day.mintemp_c : day.day.mintemp_f;
  const tempUnit = units === "metric" ? "°C" : "°F";
  const windSpeed =
    units === "metric" ? day.day.maxwind_kph : day.day.maxwind_mph;
  const windUnit = units === "metric" ? "km/h" : "mph";

  const cardClasses = `
    bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
    ${onClick ? "cursor-pointer hover:scale-105" : ""}
    ${isToday ? "ring-2 ring-blue-500 bg-blue-50" : ""}
    ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="text-center">
        <div
          className={`font-medium mb-2 ${
            isToday ? "text-blue-600" : "text-gray-800"
          }`}
        >
          {getRelativeDay(day.date)}
        </div>

        <div className="flex justify-center mb-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
            {getWeatherIcon(day.day.condition.text, 32)}
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-3 capitalize">
          {day.day.condition.text}
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-gray-800">
            {Math.round(maxTemp)}
            {tempUnit}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(minTemp)}
            {tempUnit}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Humidity</span>
            <span>{day.day.avghumidity}%</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Wind</span>
            <span>
              {Math.round(windSpeed)} {windUnit}
            </span>
          </div>
        </div>

        {isToday && (
          <div className="mt-2">
            <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              Today
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
