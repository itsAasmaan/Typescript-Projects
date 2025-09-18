import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { ForecastData, Units } from "../../types/weather";
import { getWeatherIcon } from "../../utils/weatherIcons";
import { WeatherCard } from "./WeatherCard";
import { isToday } from "../../utils/formatDate";

interface ForecastProps {
  forecast: ForecastData;
  units: Units;
  className?: string;
}

export const Forecast: React.FC<ForecastProps> = ({
  forecast,
  units,
  className = "",
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    const maxIndex = Math.max(
      0,
      forecast.forecast.forecastday.length - itemsPerPage
    );
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleDays = forecast.forecast.forecastday.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  const handleDayClick = (index: number) => {
    setSelectedDay(selectedDay === index ? null : index);
  };

  const selectedDayData =
    selectedDay !== null ? forecast.forecast.forecastday[selectedDay] : null;

  return (
    <div className={`bg-gray-50 p-6 rounded-xl ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          {forecast.forecast.forecastday.length}-Day Forecast
        </h3>

        {forecast.forecast.forecastday.length > itemsPerPage && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={
                currentIndex >=
                forecast.forecast.forecastday.length - itemsPerPage
              }
              className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {visibleDays.map((day, index) => {
          const actualIndex = currentIndex + index;
          const isTodayCard = isToday(day.date);

          return (
            <WeatherCard
              key={actualIndex}
              day={day}
              units={units}
              isToday={isTodayCard}
              onClick={() => handleDayClick(actualIndex)}
              className={
                selectedDay === actualIndex ? "ring-2 ring-blue-300" : ""
              }
            />
          );
        })}
      </div>

      {selectedDayData && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Hourly Forecast - {selectedDayData.date}
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {selectedDayData.hour
              .filter((_, index) => index % 4 === 0) // Show every 4th hour
              .map((hour, index) => {
                const temp = units === "metric" ? hour.temp_c : hour.temp_f;
                const tempUnit = units === "metric" ? "°C" : "°F";
                const time = new Date(hour.time).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  hour12: true,
                });

                return (
                  <div
                    key={index}
                    className="text-center p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="text-xs text-gray-500 mb-1">{time}</div>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(hour.condition.text, 20)}
                    </div>
                    <div className="text-sm font-medium">
                      {Math.round(temp)}
                      {tempUnit}
                    </div>
                    <div className="text-xs text-gray-400">
                      {hour.humidity}%
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-3 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">
            {forecast.forecast.forecastday.length}
          </div>
          <div className="text-sm text-gray-600">Days Available</div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(
              forecast.forecast.forecastday.reduce(
                (acc, day) =>
                  acc +
                  (units === "metric" ? day.day.maxtemp_c : day.day.maxtemp_f),
                0
              ) / forecast.forecast.forecastday.length
            )}
            °
          </div>
          <div className="text-sm text-gray-600">Avg High</div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(
              forecast.forecast.forecastday.reduce(
                (acc, day) => acc + day.day.avghumidity,
                0
              ) / forecast.forecast.forecastday.length
            )}
            %
          </div>
          <div className="text-sm text-gray-600">Avg Humidity</div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(
              forecast.forecast.forecastday.reduce(
                (acc, day) =>
                  acc +
                  (units === "metric"
                    ? day.day.maxwind_kph
                    : day.day.maxwind_mph),
                0
              ) / forecast.forecast.forecastday.length
            )}
          </div>
          <div className="text-sm text-gray-600">
            Avg Wind ({units === "metric" ? "km/h" : "mph"})
          </div>
        </div>
      </div>
    </div>
  );
};
