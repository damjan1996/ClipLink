'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EverlastNavigation from '@/components/navigation/EverlastNavigation';

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new admin dashboard
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <>
      <EverlastNavigation />
      
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-400/20">
            <span className="text-black text-3xl font-bold">🔄</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Admin-Dashboard wird geladen...</h1>
          <p className="text-gray-400 mb-6">Du wirst automatisch weitergeleitet</p>
          
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          
          <div className="mt-8 text-sm text-gray-500">
            Falls du nicht automatisch weitergeleitet wirst, 
            <a href="/admin/dashboard" className="text-yellow-400 hover:text-yellow-300 ml-1">
              klicke hier
            </a>
          </div>
        </div>
      </div>
    </>
  );
}