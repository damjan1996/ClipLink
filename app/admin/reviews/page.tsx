'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Video {
  id: string;
  clipperId: string;
  videoLink: string;
  platform: string;
  title?: string;
  viewCount: number;
  uploadDate?: string;
  submissionDate: string;
  status: string;
  bonusEligible: boolean;
  bonusAmount?: number;
  clipper: {
    name: string;
    email: string;
  };
}

export default function AdminReviewsPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/admin/login');
      return;
    }
    loadVideos();
  }, [filter, router]);

  const loadVideos = async () => {
    try {
      const response = await fetch(`/api/review/queue?status=${filter}`);
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrapeMetadata = async (videoId: string) => {
    setScraping(videoId);
    try {
      const response = await fetch('/api/video/scrape-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      });
      
      const data = await response.json();
      if (data.success) {
        await loadVideos();
      } else {
        alert(`Metadata scraping fehlgeschlagen: ${data.error}`);
      }
    } catch (error) {
      console.error('Scraping error:', error);
      alert('Fehler beim Scraping der Video-Metadaten');
    } finally {
      setScraping(null);
    }
  };

  const updateVideoStatus = async (videoId: string, newStatus: 'approved' | 'rejected', notes?: string) => {
    try {
      const endpoint = newStatus === 'approved'
        ? `/api/review/approve/${videoId}`
        : `/api/review/reject/${videoId}`;

      const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: adminData.id,
          notes
        }),
      });

      const data = await response.json();
      if (data.success) {
        await loadVideos();
      } else {
        alert(`Status-Update fehlgeschlagen: ${data.error}`);
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Fehler beim Aktualisieren des Video-Status');
    }
  };

  const handleApprove = async (video: Video) => {
    const notes = prompt('Notizen zur Genehmigung (optional):');
    await updateVideoStatus(video.id, 'approved', notes || undefined);
  };

  const handleReject = async (video: Video) => {
    const notes = prompt('Ablehnungsgrund (erforderlich):');
    if (!notes) {
      alert('Ablehnungsgrund ist erforderlich');
      return;
    }
    await updateVideoStatus(video.id, 'rejected', notes);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Videos werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black text-xl font-bold">📹</span>
              </div>
              <h1 className="text-xl font-bold text-white">Video Reviews</h1>
            </div>
            <nav className="flex items-center space-x-2">
              <Link href="/admin/dashboard" className="text-gray-400 hover:text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-gray-400 hover:text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                Users
              </Link>
              <Link href="/admin/reviews" className="bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400/20 transition-all">
                Reviews
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filter Tabs */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl mb-6 overflow-hidden">
          <div className="border-b border-gray-800">
            <nav className="-mb-px flex">
              {['pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`py-4 px-8 border-b-2 font-bold text-sm transition-all ${
                    filter === status
                      ? 'border-yellow-400 text-yellow-400 bg-yellow-400/5'
                      : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
                  }`}
                >
                  {status === 'pending' ? 'Ausstehend' : status === 'approved' ? 'Genehmigt' : 'Abgelehnt'}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Videos List */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl overflow-hidden">
          {videos.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-400 text-lg">Keine {filter === 'pending' ? 'ausstehenden' : filter === 'approved' ? 'genehmigten' : 'abgelehnten'} Videos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-black/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Video Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Clipper
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Plattform
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Bonus
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {videos.map((video) => (
                    <tr key={video.id} className="hover:bg-black/20 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          {video.title ? (
                            <div className="text-sm font-semibold text-white max-w-xs truncate mb-1">
                              {video.title}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 mb-1">Kein Titel verfügbar</div>
                          )}
                          <a
                            href={video.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-yellow-400 hover:text-yellow-300 underline transition-colors"
                          >
                            Auf {video.platform} ansehen
                          </a>
                          <div className="text-xs text-gray-500 mt-2">
                            Eingereicht: {new Date(video.submissionDate).toLocaleDateString('de-DE')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-white">{video.clipper.name}</div>
                          <div className="text-sm text-gray-500">{video.clipper.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gray-800 text-gray-300 capitalize border border-gray-700">
                          {video.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white">
                          {video.viewCount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {video.bonusEligible ? (
                          <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-green-400/10 text-green-400 border border-green-400/30">
                            €{video.bonusAmount?.toFixed(2) || '10.00'}
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                            Nicht berechtigt
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full capitalize border ${
                          video.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30' :
                          video.status === 'approved' ? 'bg-green-400/10 text-green-400 border-green-400/30' :
                          'bg-red-400/10 text-red-400 border-red-400/30'
                        }`}>
                          {video.status === 'pending' ? 'Ausstehend' : video.status === 'approved' ? 'Genehmigt' : 'Abgelehnt'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col space-y-2">
                          {!video.title && (
                            <button
                              onClick={() => scrapeMetadata(video.id)}
                              disabled={scraping === video.id}
                              className="text-yellow-400 hover:text-yellow-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {scraping === video.id ? 'Lädt...' : 'Metadata abrufen'}
                            </button>
                          )}
                          {video.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(video)}
                                className="text-green-400 hover:text-green-300 font-semibold transition-colors"
                              >
                                ✓ Genehmigen
                              </button>
                              <button
                                onClick={() => handleReject(video)}
                                className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                              >
                                ✗ Ablehnen
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}