import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';

interface SearchWeatherProps {
  onSearch: (city: string) => void;
  loading: boolean;
  onLocationSearch?: () => void;
  className?: string;
}

export const SearchWeather: React.FC<SearchWeatherProps> = ({
  onSearch,
  loading,
  onLocationSearch,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSuggestions([]);
    }
  };

  const handleLocationSearch = () => {
    if (navigator.geolocation && onLocationSearch) {
      onLocationSearch();
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const popularCities = [
    'New York', 'London', 'Tokyo', 'Paris', 'Sydney',
    'Los Angeles', 'Chicago', 'Miami', 'Berlin', 'Mumbai'
  ];

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    
    if (value.length > 2) {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (city: string) => {
    setSearchTerm(city);
    setSuggestions([]);
    onSearch(city);
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2 mb-2">
        <div className="flex-1 relative">
          <Input
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Enter city name..."
            onEnter={handleSearch}
            leftIcon={<Search className="w-4 h-4" />}
            disabled={loading}
          />
          
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {suggestions.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(city)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{city}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <Button
          onClick={handleSearch}
          disabled={loading || !searchTerm.trim()}
          loading={loading}
          variant="primary"
        >
          <Search className="w-4 h-4" />
        </Button>
        
        {onLocationSearch && (
          <Button
            onClick={handleLocationSearch}
            disabled={loading}
            variant="outline"
            // title="Use current location"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500">Popular cities:</span>
        {popularCities.slice(0, 5).map((city) => (
          <button
            key={city}
            onClick={() => handleSuggestionClick(city)}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
            disabled={loading}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};