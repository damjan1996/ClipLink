'use client';

import { useState } from 'react';

const SUPPORTED_PLATFORMS = {
  youtube: {
    regex: /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    name: 'YouTube',
    color: 'hover:border-red-500/50'
  },
  tiktok: {
    regex: /(?:tiktok\.com\/@[\w.-]+\/video\/|tiktok\.com\/v\/)(\d+)/,
    name: 'TikTok',
    color: 'hover:border-pink-500/50'
  },
  instagram: {
    regex: /(?:instagram\.com\/p\/|instagram\.com\/reel\/)([A-Za-z0-9_-]+)/,
    name: 'Instagram',
    color: 'hover:border-purple-500/50'
  },
  twitter: {
    regex: /(?:twitter\.com\/\w+\/status\/|x\.com\/\w+\/status\/)(\d+)/,
    name: 'X',
    color: 'hover:border-gray-500/50'
  },
  linkedin: {
    regex: /linkedin\.com\/posts\//,
    name: 'LinkedIn',
    color: 'hover:border-blue-500/50'
  }
};

export default function VideoLinkSubmissionForm() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    editorId: '',
    videoLink: '',
  });

  const detectPlatform = (url: string): string | null => {
    for (const [key, platform] of Object.entries(SUPPORTED_PLATFORMS)) {
      if (platform.regex.test(url)) {
        return key;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.editorId || !formData.videoLink) {
      setResult({
        status: 'error',
        message: 'Bitte fülle alle Pflichtfelder aus'
      });
      return;
    }

    const platform = detectPlatform(formData.videoLink);
    if (!platform) {
      setResult({
        status: 'error',
        message: 'Ungültiger oder nicht unterstützter Video-Link'
      });
      return;
    }

    try {
      setSubmitting(true);
      setResult(null);

      const response = await fetch('/api/video/submit-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clipperId: formData.editorId,
          videoLink: formData.videoLink,
          platform,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Übertragung fehlgeschlagen');
      }

      setResult({
        status: 'success',
        message: 'Video-Link erfolgreich eingereicht!',
        videoId: data.videoId,
      });

      // Clear form on success
      setFormData({ editorId: '', videoLink: '' });
    } catch (error) {
      console.error('Submission error:', error);
      setResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Übertragung fehlgeschlagen',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Editor ID Field */}
          <div className="group">
            <label
                htmlFor="editorId"
                className="block text-sm font-medium text-gray-400 mb-3"
            >
              Editor ID
            </label>
            <div className="relative">
              <input
                  type="text"
                  id="editorId"
                  value={formData.editorId}
                  onChange={(e) => setFormData({ ...formData, editorId: e.target.value })}
                  className="w-full px-5 py-4 bg-black/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 focus:bg-gray-900/50 transition-all duration-200"
                  placeholder="Gib deine Editor ID ein"
                  required
                  disabled={submitting}
              />
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-yellow-400/0 group-focus-within:via-yellow-400/50 to-transparent transition-all duration-300"></div>
            </div>
          </div>

          {/* Video Link Field */}
          <div className="group">
            <label
                htmlFor="videoLink"
                className="block text-sm font-medium text-gray-400 mb-3"
            >
              Video-Link
            </label>
            <div className="relative">
              <input
                  type="url"
                  id="videoLink"
                  value={formData.videoLink}
                  onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                  className="w-full px-5 py-4 bg-black/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 focus:bg-gray-900/50 transition-all duration-200"
                  placeholder="Füge deinen erstellten Clip-Link (TikTok, YouTube Shorts, Instagram Reels, etc.) ein"
                  required
                  disabled={submitting}
              />
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-yellow-400/0 group-focus-within:via-yellow-400/50 to-transparent transition-all duration-300"></div>
            </div>

            {/* Platform Detection */}
            {(() => {
              const detectedPlatform = formData.videoLink ? detectPlatform(formData.videoLink) : null;
              return detectedPlatform && detectedPlatform in SUPPORTED_PLATFORMS && (
                <div className="mt-4 inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-yellow-400">
                    {SUPPORTED_PLATFORMS[detectedPlatform as keyof typeof SUPPORTED_PLATFORMS].name} erkannt
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Supported Platforms */}
          <div className="flex flex-wrap gap-3">
            <span className="text-xs text-gray-500">Unterstützte Plattformen:</span>
            {Object.entries(SUPPORTED_PLATFORMS).map(([key, platform]) => (
                <span key={key} className="text-xs text-gray-500">
              {platform.name}
            </span>
            ))}
          </div>

          {/* Bonus Info */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Bonus-System
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-400 text-sm">€10 pro 10.000+ Views</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-400 text-sm">Monatliche Auszahlung</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-400 text-sm">Basiert auf Everlast Content</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-400 text-sm">Qualitäts-Review</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 rounded-full font-semibold transition-all duration-200 ${
                  submitting
                      ? 'bg-gray-800 cursor-not-allowed text-gray-500'
                      : 'bg-yellow-400 hover:bg-yellow-300 text-black'
              }`}
          >
            {submitting ? (
                <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Wird eingereicht...</span>
            </span>
            ) : (
                'Clip einreichen'
            )}
          </button>

          {/* Result Message */}
          {result && (
              <div className={`p-6 rounded-xl border ${
                  result.status === 'success'
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
              }`}>
                <div className="flex items-start gap-3">
                  <svg className={`w-5 h-5 mt-0.5 ${
                      result.status === 'success' ? 'text-green-500' : 'text-red-500'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {result.status === 'success' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  <div>
                    <p className={`font-semibold ${
                        result.status === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {result.message}
                    </p>
                    {result.videoId && (
                        <p className="text-sm text-gray-500 mt-1">
                          Clip-ID: <span className="font-mono text-gray-400">{result.videoId}</span>
                        </p>
                    )}
                  </div>
                </div>
              </div>
          )}
        </form>
      </div>
  );
}