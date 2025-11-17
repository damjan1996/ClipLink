'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20,
  });
  const router = useRouter();

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/admin/login');
      return;
    }

    loadUsers();
  }, [filters, router]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        search: filters.search,
        status: filters.status,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value,
    }));
  };

  const getStatusBadge = (clipper: any) => {
    if (!clipper.isActive) {
      return <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-800 text-gray-400 border border-gray-700">Inaktiv</span>;
    }
    if (clipper.paymentBlocked) {
      return <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-400/10 text-red-400 border border-red-400/30">Zahlung blockiert</span>;
    }
    if (clipper.strikes > 0) {
      return <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">{clipper.strikes} Strike(s)</span>;
    }
    return <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-400/10 text-green-400 border border-green-400/30">Aktiv</span>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black text-xl font-bold">👥</span>
              </div>
              <h1 className="text-xl font-bold text-white">User Management</h1>
            </div>
            <nav className="flex items-center space-x-2">
              <Link href="/admin/dashboard" className="text-gray-400 hover:text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                Dashboard
              </Link>
              <Link href="/admin/users" className="bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400/20 transition-all">
                Users
              </Link>
              <Link href="/admin/reviews" className="text-gray-400 hover:text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                Reviews
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-yellow-400 text-sm font-medium ml-4 transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Suche
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Name, E-Mail oder Benutzername..."
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              >
                <option value="all">Alle Benutzer</option>
                <option value="active">Aktiv</option>
                <option value="blocked">Zahlung blockiert</option>
                <option value="strikes">Hat Strikes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Sortieren nach
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              >
                <option value="createdAt">Registrierungsdatum</option>
                <option value="name">Name</option>
                <option value="totalEarnings">Gesamtverdienst</option>
                <option value="totalViews">Gesamt Views</option>
                <option value="strikes">Strikes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Reihenfolge
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              >
                <option value="desc">Absteigend</option>
                <option value="asc">Aufsteigend</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="text-lg font-bold text-white">
              Clippers ({pagination.total || 0})
            </h3>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400 mx-auto"></div>
              <p className="mt-4 text-gray-400">Benutzer werden geladen...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-black/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Clipper
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Videos
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Verdienst
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Registriert
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((clipper) => (
                    <tr key={clipper.id} className="hover:bg-black/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-white">{clipper.name}</div>
                          <div className="text-sm text-gray-500">{clipper.email}</div>
                          {clipper.username && (
                            <div className="text-xs text-gray-600 mt-1">@{clipper.username}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white">{clipper._count.videos}</div>
                        <div className="text-xs text-gray-500">
                          {clipper._count.strikes_issued > 0 && (
                            <span className="text-red-400">{clipper._count.strikes_issued} strikes</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400">
                        €{clipper.totalEarnings.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                        {clipper.totalViews.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(clipper)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(clipper.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        <Link
                          href={`/admin/users/${clipper.id}`}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          Details ansehen
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="bg-black/30 px-6 py-4 border-t border-gray-800 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Zeige {((pagination.page - 1) * pagination.limit) + 1} bis{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} von{' '}
                {pagination.total} Ergebnissen
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange('page', Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm font-semibold text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 hover:border-yellow-400/50 transition-all"
                >
                  Zurück
                </button>
                <span className="px-4 py-2 text-sm text-gray-400 flex items-center">
                  Seite {pagination.page} von {pagination.pages}
                </span>
                <button
                  onClick={() => handleFilterChange('page', Math.min(pagination.pages, pagination.page + 1))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm font-semibold text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 hover:border-yellow-400/50 transition-all"
                >
                  Weiter
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}