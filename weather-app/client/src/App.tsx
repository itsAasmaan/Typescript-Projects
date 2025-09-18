import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home';
import type { Units } from './types/weather';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Weather App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  // Load units preference from localStorage
  const [units, setUnits] = useState<Units>(() => {
    try {
      const savedUnits = localStorage.getItem('weather-app-units');
      return (savedUnits as Units) || 'metric';
    } catch {
      return 'metric';
    }
  });

  // Save units preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('weather-app-units', units);
    } catch (error) {
      console.warn('Failed to save units preference:', error);
    }
  }, [units]);

  const handleUnitsChange = (newUnits: Units) => {
    setUnits(newUnits);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <Layout
          units={units}
          onUnitsChange={handleUnitsChange}
        >
          <Home />
        </Layout>
      </div>
    </ErrorBoundary>
  );
};

export default App;