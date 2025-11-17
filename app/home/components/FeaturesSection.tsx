export default function FeaturesSection() {
  return (
      <section className="py-32 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-6 py-2 mb-8">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-yellow-400 font-medium">Für Editoren</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-300 mb-6">
              Erstelle <span className="text-white font-normal">Clips</span> aus <span className="text-white font-normal">Everlast Content</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
              Verwandle bestehenden Everlast YouTube Content in virale Social Media Clips
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400/10 rounded-xl mb-6 group-hover:bg-yellow-400/20 transition-colors">
                <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Everlast Content Pool</h3>
              <p className="text-gray-400 leading-relaxed">
                Zugriff auf den gesamten Everlast YouTube Content als Basis für deine Clips.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400/10 rounded-xl mb-6 group-hover:bg-yellow-400/20 transition-colors">
                <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Verdienst pro Clip</h3>
              <p className="text-gray-400 leading-relaxed">
                Verdiene €10 für jeden Clip mit über 10.000 Views. Monatliche Auszahlung direkt auf dein Konto.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400/10 rounded-xl mb-6 group-hover:bg-yellow-400/20 transition-colors">
                <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Alle Clip-Formate</h3>
              <p className="text-gray-400 leading-relaxed">
                YouTube Shorts, TikTok, Instagram Reels, X Videos - erstelle Clips für alle Plattformen.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400/10 rounded-xl mb-6 group-hover:bg-yellow-400/20 transition-colors">
                <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Performance Tracking</h3>
              <p className="text-gray-400 leading-relaxed">
                Verfolge die Performance deiner Clips in Echtzeit. Jeder View wird transparent dokumentiert.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400/10 rounded-xl mb-6 group-hover:bg-yellow-400/20 transition-colors">
                <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Einfacher Start</h3>
              <p className="text-gray-400 leading-relaxed">
                Registriere dich, wähle Everlast Content aus, erstelle deinen Clip und reiche ihn ein.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400/10 rounded-xl mb-6 group-hover:bg-yellow-400/20 transition-colors">
                <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Qualität & Support</h3>
              <p className="text-gray-400 leading-relaxed">
                Jeder Clip wird geprüft. Unser Team unterstützt dich bei Fragen zur Content-Erstellung.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <a
                href="#video-submission"
                className="inline-block bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition-colors"
            >
              Clips jetzt einreichen
            </a>
          </div>
        </div>
      </section>
  );
}