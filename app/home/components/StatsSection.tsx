export default function StatsSection() {
  return (
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-6 py-2 mb-8">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-yellow-400 font-medium">Editor Erfolg</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-300 mb-6">
              Editoren verdienen <span className="text-white font-normal">mehr</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8">
              Hunderte Editoren erstellen bereits erfolgreich Clips aus Everlast Content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="text-center group">
              <div className="mb-4">
              <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                150+
              </span>
              </div>
              <div className="text-gray-400 leading-relaxed">
                Editoren erstellen<br />
                bereits Clips aus<br />
                Everlast Content
              </div>
            </div>

            {/* Stat 2 */}
            <div className="text-center group">
              <div className="mb-4">
              <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                €12K
              </span>
              </div>
              <div className="text-gray-400 leading-relaxed">
                bereits ausgezahlt<br />
                an Editoren<br />
                in diesem Monat
              </div>
            </div>

            {/* Stat 3 */}
            <div className="text-center group">
              <div className="mb-4">
              <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                2.5M+
              </span>
              </div>
              <div className="text-gray-400 leading-relaxed">
                Clip-Views<br />
                wurden bereits<br />
                generiert
              </div>
            </div>

            {/* Stat 4 */}
            <div className="text-center group">
              <div className="mb-4">
              <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                94%
              </span>
              </div>
              <div className="text-gray-400 leading-relaxed">
                Zufriedenheitsrate<br />
                bei Everlast<br />
                Editoren
              </div>
            </div>
          </div>

          {/* Additional insight */}
          <div className="mt-24 text-center">
            <div className="max-w-3xl mx-auto bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                <span className="text-white font-semibold">Wusstest du?</span> Editoren, die regelmäßig Clips aus Everlast Content erstellen,
                verdienen durchschnittlich <span className="text-yellow-400 font-semibold">€80 zusätzlich pro Monat</span>
                mit ihren Editing-Skills.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <a
                href="#video-submission"
                className="inline-block bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-yellow-300 transition-colors"
            >
              Starte als Everlast Editor
            </a>
          </div>
        </div>
      </section>
  );
}