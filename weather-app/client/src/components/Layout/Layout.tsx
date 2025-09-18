// src/components/Layout/Layout.tsx
import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import type { Units } from '../../types/weather';

interface LayoutProps {
  children: React.ReactNode;
  units: Units;
  onUnitsChange: (units: Units) => void;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  units,
  onUnitsChange,
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col ${className}`}>
      <Navbar units={units} onUnitsChange={onUnitsChange} />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};