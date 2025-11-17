'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EverlastNavigation from '@/components/navigation/EverlastNavigation';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('admin', JSON.stringify(data.admin));
        localStorage.setItem('adminToken', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login fehlgeschlagen');
      }
    } catch (error) {
      setError('Login fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <EverlastNavigation />
      
      <div className="min-h-screen bg-black pt-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-md w-full mx-auto px-6 relative z-10">
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-400/20">
                <span className="text-black text-3xl font-bold">🔐</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">Admin Login</h1>
              <p className="text-gray-400 text-lg">
                Melde dich an, um auf das Admin-Dashboard zuzugreifen
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-5 py-4 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">⚠️</span>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-3">
                  Benutzername
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-5 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="admin"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-3">
                  Passwort
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-5 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  loading
                    ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black shadow-yellow-400/20 hover:shadow-yellow-400/40'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Wird angemeldet...</span>
                  </span>
                ) : (
                  'Anmelden'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="text-center text-sm">
                <p className="mb-4 text-gray-400 font-medium">🎯 Demo-Anmeldedaten:</p>
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-5 space-y-3 border border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Benutzer:</span>
                    <code className="bg-gray-900 text-yellow-400 px-4 py-2 rounded-lg font-mono font-semibold border border-gray-800">admin</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Passwort:</span>
                    <code className="bg-gray-900 text-yellow-400 px-4 py-2 rounded-lg font-mono font-semibold border border-gray-800">admin123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}