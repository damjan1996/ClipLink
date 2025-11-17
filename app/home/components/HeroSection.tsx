import Link from 'next/link';

export default function HeroSection() {
  return (
      <section
          id="hero"
          className="relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black text-white"
      >
        {/* Soft Glows im Hintergrund */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-yellow-500/15 blur-3xl" />
          <div className="absolute left-1/2 top-40 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-zinc-700/30 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center px-6 pb-24 pt-28">
          {/* Text-Block wie im Screenshot */}
          <div className="max-w-3xl space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-yellow-400">
              Content Editing · Clip Creation · Everlast
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Erstelle{' '}
              <span className="text-yellow-300">Virale Clips</span>
              <br />
              aus <span className="text-yellow-300">Everlast Content</span>
            </h1>

            <p className="max-w-xl text-base text-zinc-300 sm:text-lg">
              Nimm dir den bestehenden YouTube Content von Everlast und erstelle daraus
              packende Clips für TikTok, YouTube Shorts und andere Social Media Plattformen.
              Verdiene bis zu €10 pro 10.000 Views.
            </p>

            {/* CTA-Buttons */}
            <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a
                  href="#video-submission"
                  className="inline-flex items-center justify-center rounded-full bg-yellow-300 px-8 py-3 text-sm font-semibold text-black shadow-lg shadow-yellow-500/30 transition hover:bg-yellow-200"
              >
                Clips einreichen
              </a>

              <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-8 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900/60"
              >
                Dashboard ansehen
              </Link>
            </div>

            {/* Social Proof / Trust-Bereich */}
            <div className="mt-10 flex flex-wrap items-center gap-8 text-sm text-zinc-400">
              {/* Trustpilot-Block */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-100 ring-1 ring-zinc-700">
                  TrustScore 4,9
                </div>
                <div className="flex items-center gap-1 text-yellow-300">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>
                <span className="text-xs text-zinc-400">basierend auf 2.800+ Creator</span>
              </div>

              {/* Creator-Statistik */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-zinc-700" />
                  <div className="h-8 w-8 rounded-full bg-zinc-600" />
                  <div className="h-8 w-8 rounded-full bg-zinc-500" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-zinc-100">Bereits über 150 Editoren</p>
                  <p className="text-zinc-400">erstellen Clips für Everlast</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logos / "Featured in" – unten, wie im Screenshot */}
          <div className="mt-16 border-t border-zinc-800 pt-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Clip Formate
            </p>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-xs uppercase tracking-[0.25em] text-zinc-500">
              <span className="font-semibold text-zinc-300">YouTube Shorts</span>
              <span>TikTok</span>
              <span>Instagram Reels</span>
              <span>X Videos</span>
              <span>LinkedIn Videos</span>
            </div>
          </div>
        </div>
      </section>
  );
}
