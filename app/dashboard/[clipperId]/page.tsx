'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const params = useParams();
  const router = useRouter();
  const clipperId = params.clipperId as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/clipper/${clipperId}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [clipperId]);

  const handleLogout = () => {
    localStorage.removeItem('clipper');
    localStorage.removeItem('clipperId');
    router.push('/');
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

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-gray-400 text-lg">Fehler beim Laden der Daten</p>
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
                <span className="text-black text-xl font-bold">🎬</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Clipper Dashboard</h1>
                <p className="text-xs text-gray-400">{data.clipper.name}</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-400 hover:text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Neues Video einreichen
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-yellow-400 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Gesamt Videos</h3>
              <div className="w-10 h-10 bg-blue-400/10 rounded-xl flex items-center justify-center">
                <span className="text-blue-400 text-xl">📹</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-1">{data.videos.length}</p>
            <p className="text-xs text-gray-500">Eingereichte Videos</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-green-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Verdienst</h3>
              <div className="w-10 h-10 bg-green-400/10 rounded-xl flex items-center justify-center">
                <span className="text-green-400 text-xl">💰</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-green-400 mb-1">
              €{data.videos.reduce((sum: number, v: any) => sum + (v.basePayment || 0), 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Gesamtverdienst</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Strikes</h3>
              <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-1">{data.clipper.strikes}</p>
            <p className="text-xs text-gray-500">von 3 maximal</p>
          </div>
        </div>

        {/* Strikes Warning */}
        {data.clipper.strikes > 0 && (
          <div className={`mb-8 rounded-2xl p-6 border ${
            data.clipper.strikes >= 3 
              ? 'bg-red-500/10 border-red-500/50' 
              : 'bg-yellow-400/10 border-yellow-400/50'
          }`}>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-2 ${
                  data.clipper.strikes >= 3 ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  Warnung: {data.clipper.strikes} Strike(s)
                </h3>
                <p className="text-white mb-2">
                  Du hast aktuell {data.clipper.strikes} von 3 möglichen Strikes.
                  {data.clipper.strikes >= 3 && ' Dein Account wurde gesperrt!'}
                </p>
                {data.clipper.paymentBlocked && (
                  <p className="text-red-400 font-semibold">
                    🚫 Zahlungen sind blockiert. Bitte kontaktiere den Support.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Videos Table */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-800 bg-black/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center">
                <span className="text-yellow-400 text-xl">📊</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Meine Videos</h2>
                <p className="text-sm text-gray-400 mt-1">Übersicht aller eingereichten Videos</p>
              </div>
            </div>
          </div>

          {data.videos.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-400 text-lg font-medium">Noch keine Videos eingereicht</p>
              <p className="text-gray-600 text-sm mt-2">
                <Link href="/" className="text-yellow-400 hover:text-yellow-300 underline">
                  Reiche jetzt dein erstes Video ein
                </Link>
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Typ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Zahlung
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Datum
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {data.videos.map((video: any) => (
                    <tr key={video.id} className="hover:bg-black/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                            <span className="text-xl">🎥</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white max-w-xs truncate">
                              {video.filename}
                            </p>
                            {video.videoLink && (
                              <a
                                href={video.videoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-yellow-400 hover:text-yellow-300 underline"
                              >
                                Video ansehen ↗
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full capitalize border ${
                          video.validationStatus === 'approved' 
                            ? 'bg-green-400/10 text-green-400 border-green-400/30' :
                          video.validationStatus === 'rejected' 
                            ? 'bg-red-400/10 text-red-400 border-red-400/30' :
                          'bg-yellow-400/10 text-yellow-400 border-yellow-400/30'
                        }`}>
                          {video.validationStatus === 'approved' ? 'Genehmigt' :
                           video.validationStatus === 'rejected' ? 'Abgelehnt' :
                           video.validationStatus === 'pending' ? 'Ausstehend' :
                           'In Prüfung'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-white capitalize">
                          {video.videoType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {video.basePayment ? (
                          <span className="text-sm font-bold text-green-400">
                            €{video.basePayment.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {new Date(video.uploadDate).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 border border-yellow-400/30 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Tipps für mehr Verdienst</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Videos mit über 10.000 Views erhalten automatisch €10 Bonus</li>
                <li>✓ Stelle sicher, dass deine Video-Links öffentlich zugänglich sind</li>
                <li>✓ Vermeide Duplikate - jedes Video darf nur einmal eingereicht werden</li>
                <li>✓ Hochwertige, originale Inhalte werden bevorzugt genehmigt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}