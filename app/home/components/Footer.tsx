import Link from 'next/link';

export default function Footer() {
  return (
      <footer className="bg-black border-t border-gray-800 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold text-white mb-4">ClipLink</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Die Plattform für Editoren, um aus Everlast YouTube Content
                virale Social Media Clips zu erstellen und zu monetarisieren.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center hover:bg-yellow-400/20 transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.85.38-1.75.65-2.71.77a4.74 4.74 0 002.07-2.63 9.44 9.44 0 01-3 1.15 4.72 4.72 0 00-8.16 3.23c0 .37.04.73.11 1.08a13.4 13.4 0 01-9.73-4.93 4.72 4.72 0 001.46 6.3c-.78-.02-1.51-.24-2.15-.6v.06a4.72 4.72 0 003.79 4.63 4.75 4.75 0 01-2.13.08 4.73 4.73 0 004.41 3.28A9.49 9.49 0 010 20.54a13.38 13.38 0 007.29 2.14c8.74 0 13.51-7.24 13.51-13.52 0-.2 0-.41-.01-.61A9.65 9.65 0 0024 4.59a9.44 9.44 0 01-2.71.74 4.74 4.74 0 002.07-2.63l.1-.7z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center hover:bg-yellow-400/20 transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center hover:bg-yellow-400/20 transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Leistungen */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Leistungen</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/ki-beratung" className="text-gray-400 hover:text-yellow-400 transition-colors">KI-Beratung</a></li>
                <li><a href="/prozessautomatisierung" className="text-gray-400 hover:text-yellow-400 transition-colors">Prozessautomatisierung</a></li>
                <li><a href="/datenanalyse" className="text-gray-400 hover:text-yellow-400 transition-colors">Datenanalyse</a></li>
                <li><a href="/chatbots" className="text-gray-400 hover:text-yellow-400 transition-colors">Chatbot-Entwicklung</a></li>
                <li><a href="/workshops" className="text-gray-400 hover:text-yellow-400 transition-colors">KI-Workshops</a></li>
              </ul>
            </div>

            {/* Unternehmen */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Unternehmen</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/uber-uns" className="text-gray-400 hover:text-yellow-400 transition-colors">Über uns</a></li>
                <li><a href="/referenzen" className="text-gray-400 hover:text-yellow-400 transition-colors">Referenzen</a></li>
                <li><a href="/karriere" className="text-gray-400 hover:text-yellow-400 transition-colors">Karriere</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-yellow-400 transition-colors">Blog</a></li>
                <li><a href="/kontakt" className="text-gray-400 hover:text-yellow-400 transition-colors">Kontakt</a></li>
              </ul>
            </div>

            {/* Kontakt */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Kontakt</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                  Everlast Consulting GmbH<br />
                  Rißstraße 17<br />
                  88400 Biberach an der Riß
                </span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@everlast.ai" className="hover:text-yellow-400 transition-colors">
                    info@everlast.ai
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+498912345678" className="hover:text-yellow-400 transition-colors">
                    +49 176 66367935
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p className="mb-4 md:mb-0">
              © 2025 Everlast Consulting GmbH. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6">
              <a href="/datenschutz" className="hover:text-yellow-400 transition-colors">Datenschutz</a>
              <a href="/agb" className="hover:text-yellow-400 transition-colors">AGB</a>
              <a href="/impressum" className="hover:text-yellow-400 transition-colors">Impressum</a>
              <a href="/cookies" className="hover:text-yellow-400 transition-colors">Cookie-Einstellungen</a>
            </div>
          </div>
        </div>
      </footer>
  );
}