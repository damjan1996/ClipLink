'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check admin authentication
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/admin/login');
      return;
    }

    setAdmin(JSON.parse(adminData));
    loadAnalytics();
  }, [router]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics?period=30');
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black text-xl font-bold">📊</span>
              </div>
              <h1 className="text-xl font-bold text-white">Clipper Admin</h1>
            </div>
            <nav className="flex items-center space-x-2">
              <Link
                href="/admin/dashboard"
                className="bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400/20 transition-all"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="text-gray-400 hover:text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Users
              </Link>
              <Link
                href="/admin/reviews"
                className="text-gray-400 hover:text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Reviews
              </Link>
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-800">
                <span className="text-sm text-gray-400">Hallo, {admin?.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-yellow-400 text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {analytics && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-400/10 rounded-xl">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Gesamt Clippers</p>
                    <p className="text-3xl font-bold text-white mt-1">{analytics.overview.total.clippers}</p>
                    <p className="text-xs text-green-400 mt-1">+{analytics.overview.recent.newClippers} diesen Monat</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all">
                <div className="flex items-center">
                  <div className="p-3 bg-green-400/10 rounded-xl">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Gesamt Videos</p>
                    <p className="text-3xl font-bold text-white mt-1">{analytics.overview.total.videos}</p>
                    <p className="text-xs text-green-400 mt-1">+{analytics.overview.recent.newVideos} diesen Monat</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-400/10 rounded-xl">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Ausstehende Reviews</p>
                    <p className="text-3xl font-bold text-white mt-1">{analytics.overview.total.pendingManualReviews}</p>
                    <p className="text-xs text-yellow-400 mt-1">Benötigt Aufmerksamkeit</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all">
                <div className="flex items-center">
                  <div className="p-3 bg-red-400/10 rounded-xl">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Gesamt Strikes</p>
                    <p className="text-3xl font-bold text-white mt-1">{analytics.overview.total.strikes}</p>
                    <p className="text-xs text-red-400 mt-1">+{analytics.overview.recent.newStrikes} diesen Monat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Status & Platform Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Video Status Verteilung</h3>
                <div className="space-y-4">
                  {analytics.distributions.statuses.map((status: any) => (
                    <div key={status.status} className="flex justify-between items-center p-3 bg-black/30 rounded-xl">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          status.status === 'approved' ? 'bg-green-400' :
                          status.status === 'rejected' ? 'bg-red-400' :
                          status.status === 'manual_review' ? 'bg-yellow-400' :
                          'bg-gray-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-300 capitalize">
                          {status.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-white">{status.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Plattform Verteilung</h3>
                <div className="space-y-4">
                  {analytics.distributions.platforms.map((platform: any) => (
                    <div key={platform.platform} className="flex justify-between items-center p-3 bg-black/30 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-3 bg-yellow-400"></div>
                        <span className="text-sm font-medium text-gray-300 capitalize">
                          {platform.platform}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-white">{platform.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Clippers */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl mb-8 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white">Top Performing Clippers</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-black/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Clipper</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Videos</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Gesamt Views</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Verdienst</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Strikes</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {analytics.topClippers.map((clipper: any) => (
                      <tr key={clipper.id} className="hover:bg-black/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-white">{clipper.name}</div>
                            <div className="text-sm text-gray-500">{clipper.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {clipper.videoCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {clipper.totalViews.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400">
                          €{clipper.totalEarnings.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                            clipper.strikes === 0 ? 'bg-green-400/10 text-green-400' :
                            clipper.strikes < 3 ? 'bg-yellow-400/10 text-yellow-400' :
                            'bg-red-400/10 text-red-400'
                          }`}>
                            {clipper.strikes}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/admin/users/${clipper.id}`} className="text-yellow-400 hover:text-yellow-300 transition-colors">
                            Details ansehen
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white">Letzte Aktivitäten</h3>
              </div>
              <div className="divide-y divide-gray-800">
                {analytics.recentActivity.slice(0, 10).map((activity: any) => (
                  <div key={activity.id} className="px-6 py-4 hover:bg-black/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-4 ${
                          activity.type === 'upload' ? 'bg-blue-400' :
                          activity.type === 'review' ? 'bg-purple-400' :
                          activity.type === 'strike' ? 'bg-red-400' :
                          activity.type === 'payment' ? 'bg-green-400' :
                          'bg-gray-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {activity.description}
                          </p>
                          {activity.clipperName && (
                            <p className="text-sm text-gray-500">von {activity.clipperName}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}