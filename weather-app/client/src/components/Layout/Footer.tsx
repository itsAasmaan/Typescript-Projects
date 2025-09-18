import React from "react";
import { Cloud, Github, Twitter, Mail, Heart } from "lucide-react";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gray-800 text-white ${className}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">WeatherApp</h3>
                <p className="text-gray-400 text-sm">
                  Real-time weather updates
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Get accurate and up-to-date weather information for any location
              around the world. Plan your day with confidence using our detailed
              forecasts and weather insights.
            </p>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg">
                <Github className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Current Weather
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  5-Day Forecast
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Weather Maps
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Weather Alerts
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Help Center
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  API Documentation
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Report Issue
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-2">
                Data Sources
              </h5>
              <p className="text-xs text-gray-400">
                Weather data provided by reliable meteorological services and
                updated in real-time to ensure accuracy and reliability.
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-2">
                Coverage
              </h5>
              <p className="text-xs text-gray-400">
                Global weather coverage including current conditions, forecasts,
                and weather alerts for millions of locations worldwide.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span>© {currentYear} WeatherApp. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for weather enthusiasts</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <button className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
