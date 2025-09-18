import React, { useState } from 'react';
import { Cloud, Menu, X, Settings, Info } from 'lucide-react';
import type { Units } from '../../types/weather';

interface NavbarProps {
  units: Units;
  onUnitsChange: (units: Units) => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  units,
  onUnitsChange,
  className = ''
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleUnitChange = (newUnits: Units) => {
    onUnitsChange(newUnits);
    setIsSettingsOpen(false);
  };

  return (
    <nav className={`bg-white shadow-lg relative ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">WeatherApp</h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Real-time weather updates
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  units === 'metric' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handleUnitChange('metric')}
              >
                °C
              </button>
              <button
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  units === 'imperial' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handleUnitChange('imperial')}
              >
                °F
              </button>
            </div>

            <button
              onClick={toggleSettings}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="About"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <div className="px-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature Unit
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`flex-1 py-2 rounded text-sm font-medium transition-all ${
                      units === 'metric' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => handleUnitChange('metric')}
                  >
                    Celsius (°C)
                  </button>
                  <button
                    className={`flex-1 py-2 rounded text-sm font-medium transition-all ${
                      units === 'imperial' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => handleUnitChange('imperial')}
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              <div className="space-y-2 px-4">
                <button className="flex items-center gap-3 w-full text-left p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
                <button className="flex items-center gap-3 w-full text-left p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <Info className="w-5 h-5" />
                  About
                </button>
              </div>
            </div>
          </div>
        )}

        {isSettingsOpen && (
          <div className="absolute right-4 top-16 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature Unit
                  </label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all ${
                        units === 'metric' 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      onClick={() => handleUnitChange('metric')}
                    >
                      Celsius
                    </button>
                    <button
                      className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all ${
                        units === 'imperial' 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      onClick={() => handleUnitChange('imperial')}
                    >
                      Fahrenheit
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-500">
                    <p className="mb-1">WeatherApp v1.0.0</p>
                    <p>Real-time weather data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile menu and settings */}
      {(isMenuOpen || isSettingsOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsSettingsOpen(false);
          }}
        />
      )}
    </nav>
  );
};