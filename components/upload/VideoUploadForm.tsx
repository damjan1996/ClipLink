'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function VideoUploadForm() {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    editorId: '',
    uploadLink: '',
    platform: 'youtube',
    videoType: 'normal',
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);
      setResult(null);

      // Simulate upload process
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Simulate processing
      setUploading(false);
      setProcessing(true);

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock result
      setResult({
        decision: 'auto_approve',
        status: 'approved',
        confidence: 0.95,
        videoId: 'VID-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      });
    } catch (error) {
      setResult({
        decision: 'error',
        status: 'failed',
        confidence: 0,
        error: 'Upload failed',
      });
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi'] },
    maxFiles: 1,
    disabled: uploading || processing,
  });

  return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Editor ID
              </label>
              <input
                  type="text"
                  placeholder="Gib deine Editor ID ein"
                  value={formData.editorId}
                  onChange={(e) => setFormData({ ...formData, editorId: e.target.value })}
                  className="w-full px-5 py-4 bg-black/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 focus:bg-gray-900/50 transition-all duration-200"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Clip Link
              </label>
              <input
                  type="text"
                  placeholder="Link zu deinem erstellten Clip"
                  value={formData.uploadLink}
                  onChange={(e) => setFormData({ ...formData, uploadLink: e.target.value })}
                  className="w-full px-5 py-4 bg-black/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 focus:bg-gray-900/50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Platform
              </label>
              <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-5 py-4 bg-black/50 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-yellow-400/50 focus:bg-gray-900/50 transition-all duration-200 appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 1.25rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25em',
                  }}
              >
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">X (Twitter)</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Video Type
              </label>
              <select
                  value={formData.videoType}
                  onChange={(e) => setFormData({ ...formData, videoType: e.target.value })}
                  className="w-full px-5 py-4 bg-black/50 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-yellow-400/50 focus:bg-gray-900/50 transition-all duration-200 appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 1.25rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.25em',
                  }}
              >
                <option value="normal">Normal Clip</option>
                <option value="short">Short Clip</option>
              </select>
            </div>
          </div>

          {/* Drop Zone */}
          <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
            ${isDragActive
                  ? 'border-yellow-400/50 bg-yellow-400/5'
                  : 'border-gray-800 hover:border-gray-700 bg-gray-900/30'
              }
            ${(uploading || processing) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  isDragActive ? 'bg-yellow-400/20' : 'bg-gray-800'
              }`}>
                <svg className={`w-10 h-10 transition-all duration-300 ${
                    isDragActive ? 'text-yellow-400' : 'text-gray-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              {isDragActive ? (
                  <p className="text-lg text-yellow-400 font-medium">Lasse den Clip hier los</p>
              ) : (
                  <>
                    <p className="text-lg text-white font-medium mb-2">
                      Clip hier ablegen oder klicken
                    </p>
                    <p className="text-sm text-gray-500">
                      MP4, MOV, AVI • Max 100MB • Basierend auf Everlast Content
                    </p>
                  </>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {(uploading || processing) && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                {uploading ? 'Wird hochgeladen...' : 'Wird verarbeitet...'}
              </span>
                  <span className="text-yellow-400">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
          )}

          {/* Result */}
          {result && (
              <div className={`p-6 rounded-xl border ${
                  result.decision === 'auto_approve'
                      ? 'bg-green-500/10 border-green-500/20'
                      : result.decision === 'auto_reject'
                          ? 'bg-red-500/10 border-red-500/20'
                          : result.decision === 'error'
                              ? 'bg-red-500/10 border-red-500/20'
                              : 'bg-yellow-500/10 border-yellow-500/20'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      result.decision === 'auto_approve'
                          ? 'bg-green-500/20'
                          : result.decision === 'auto_reject' || result.decision === 'error'
                              ? 'bg-red-500/20'
                              : 'bg-yellow-500/20'
                  }`}>
                    <svg className={`w-5 h-5 ${
                        result.decision === 'auto_approve'
                            ? 'text-green-500'
                            : result.decision === 'auto_reject' || result.decision === 'error'
                                ? 'text-red-500'
                                : 'text-yellow-500'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {result.decision === 'auto_approve' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : result.decision === 'auto_reject' || result.decision === 'error' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>

                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                        result.decision === 'auto_approve'
                            ? 'text-green-500'
                            : result.decision === 'auto_reject' || result.decision === 'error'
                                ? 'text-red-500'
                                : 'text-yellow-500'
                    }`}>
                      {result.decision === 'auto_approve'
                          ? 'Clip genehmigt'
                          : result.decision === 'auto_reject'
                              ? 'Clip abgelehnt'
                              : result.decision === 'error'
                                  ? 'Upload fehlgeschlagen'
                                  : 'Manuelle Überprüfung erforderlich'}
                    </h3>

                    {result.error ? (
                        <p className="text-gray-400 text-sm">{result.error}</p>
                    ) : (
                        <div className="space-y-1">
                          <p className="text-gray-400 text-sm">
                            Status: <span className="text-gray-300">{result.status}</span>
                          </p>
                          <p className="text-gray-400 text-sm">
                            Konfidenz: <span className="text-gray-300">{(result.confidence * 100).toFixed(0)}%</span>
                          </p>
                          {result.videoId && (
                              <p className="text-gray-400 text-sm">
                                Clip-ID: <span className="font-mono text-gray-300">{result.videoId}</span>
                              </p>
                          )}
                        </div>
                    )}
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}