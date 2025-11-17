import Link from 'next/link';

export default function FinalCtaSection() {
  return (
      <section className="py-32 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-300 mb-6">
            Bereit als <span className="text-white font-normal">Editor</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Erstelle jetzt Clips aus Everlast Content und verdiene mit deinen Editing-Skills.
            Einfach, transparent und ohne Risiko.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
                href="#video-submission"
                className="px-8 py-4 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/20"
            >
              Clips jetzt einreichen
            </a>
            <a
                href="/dashboard"
                className="px-8 py-4 border-2 border-gray-700 text-gray-300 font-semibold rounded-full hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 transform hover:scale-105"
            >
              Dashboard ansehen
            </a>
          </div>

          {/* Trust elements */}
          <div className="mt-16 pt-16 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
                <div className="text-gray-500 text-sm">Kostenlos & ohne Risiko</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">€10</div>
                <div className="text-gray-500 text-sm">Pro 10K+ Views</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">150+</div>
                <div className="text-gray-500 text-sm">Aktive Editoren</div>
              </div>
            </div>
          </div>

          {/* Final tagline */}
          <div className="mt-20">
            <p className="text-gray-500 text-lg">
              Everlast Content wartet auf deine Kreativität. <span className="text-white">Starte jetzt.</span>
            </p>
          </div>
        </div>
      </section>
  );
}