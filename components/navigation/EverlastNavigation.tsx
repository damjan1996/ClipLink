'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EverlastNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll-Effekt für Navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('video-submission');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
              ? 'bg-black/95 backdrop-blur-lg'
              : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
                href="/"
                className="text-2xl font-bold text-white hover:text-gray-300 transition-colors duration-200"
            >
              everlast.ai
            </Link>

            {/* CTA Button */}
            <Link
                href="#video-submission"
                onClick={handleSmoothScroll}
                className="px-6 py-3 bg-yellow-400 text-black font-medium rounded-full hover:bg-yellow-300 transition-colors duration-200"
            >
              Jetzt starten
            </Link>
          </div>
        </div>
      </nav>
  );
}