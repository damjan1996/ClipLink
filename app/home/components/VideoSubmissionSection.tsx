import VideoLinkSubmissionForm from '@/components/upload/VideoLinkSubmissionForm';

export default function VideoSubmissionSection() {
  return (
      <section id="video-submission" className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-300 mb-6">
              Erstelle <span className="text-white font-normal">virale Clips</span> aus
            </h2>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-300 mb-8">
              Everlast <span className="text-white font-normal">Content</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
              Transformiere YouTube-Content in virale Social Media Clips.
              Verdiene bis zu €10 für jeden Clip mit über 10.000 Views.
            </p>
          </div>

          {/* Form Container */}
          <div className="max-w-2xl mx-auto mb-20">
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 md:p-12">
              <VideoLinkSubmissionForm />
            </div>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-yellow-400">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Clip erstellen</h3>
                <p className="text-sm text-gray-400">
                  Schneide virale Momente aus Everlast YouTube-Videos
                </p>
              </div>
              {/* Connector Line (hidden on mobile) */}
              <div className="hidden md:block absolute top-8 left-[60%] w-full h-[1px] bg-gradient-to-r from-gray-800 to-transparent"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-yellow-400">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Link einreichen</h3>
                <p className="text-sm text-gray-400">
                  Teile den Social Media Link deines hochgeladenen Clips
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-8 left-[60%] w-full h-[1px] bg-gradient-to-r from-gray-800 to-transparent"></div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-yellow-400">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Geld verdienen</h3>
                <p className="text-sm text-gray-400">
                  Erhalte €10 für jeden Clip mit über 10.000 Views
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-24 border-t border-gray-800 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">€10</div>
                <div className="text-sm text-gray-500">Pro viralen Clip</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">10K+</div>
                <div className="text-sm text-gray-500">Views benötigt</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">24h</div>
                <div className="text-sm text-gray-500">Schnelle Prüfung</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
                <div className="text-sm text-gray-500">Sichere Auszahlung</div>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-16 flex justify-center">
            <div className="inline-flex items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-full px-6 py-3">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-gray-400">
              Verifiziertes Partnerprogramm • Sichere Zahlungen • Transparente Bedingungen
            </span>
            </div>
          </div>
        </div>
      </section>
  );
}