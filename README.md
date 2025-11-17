# Clipper System MVP Prototyp

Ein Video-Duplikatserkennungssystem für Content-Creator, gebaut mit Next.js, TypeScript, Vercel Postgres und Vercel Blob Storage.

## Features

- **Video Upload & Verarbeitung**: Drag & Drop Upload mit Client-Side Video Processing
- **Duplikaterkennung**: Automatische Erkennung von duplizierten Videos basierend auf Bild- und Audio-Fingerprints
- **Clipper Dashboard**: Übersicht über hochgeladene Videos, Strikes und Zahlungsstatus
- **Admin Panel**: Manuelle Review-Queue für unsichere Fälle
- **Zahlungssystem**: Automatische Berechnung von Basis-Zahlungen (0.60€ für normale Clips, 0.30€ für Übersetzungen)
- **Strike-System**: Automatische Strikes bei Duplikaten, Zahlungsstopp bei 3+ Strikes

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless Functions)
- **Video Processing**: FFmpeg (Client-Side via @ffmpeg/ffmpeg)
- **Datenbank**: Vercel Postgres (PostgreSQL)
- **File Storage**: Vercel Blob Storage
- **Deployment**: Vercel

## Setup

### 1. Environment Variables

Erstelle eine `.env.local` Datei mit:

```env
# Database
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

### 2. Installation

```bash
npm install
```

### 3. Datenbank Setup

```bash
# Prisma Client generieren
npx prisma generate

# Migrations ausführen
npx prisma migrate dev
```

### 4. Development Server

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Deployment

### 1. Vercel Setup

```bash
# Vercel CLI installieren
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 2. Environment Variables in Vercel

Setze die Environment Variables im Vercel Dashboard:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `BLOB_READ_WRITE_TOKEN`

### 3. Production Migrations

```bash
npx prisma migrate deploy
```

## Usage

### 1. Clipper registrieren

POST `/api/clipper/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "registeredChannels": ["youtube", "tiktok"]
}
```

### 2. Video hochladen

1. Gehe zur Homepage
2. Gib die Clipper ID ein
3. Wähle Platform und Video-Typ
4. Drag & Drop oder klicke um Video auszuwählen
5. Warte auf Upload und Processing

### 3. Dashboard

Besuche `/dashboard/[clipperId]` um:
- Alle Videos zu sehen
- Strike-Warnungen zu erhalten
- Zahlungsstatus zu prüfen

### 4. Admin Panel

Besuche `/admin` um:
- Statistiken einzusehen
- Manual Review Queue zu verwalten
- Videos zu approven/rejecten

## API Endpoints

- `POST /api/clipper/register` - Clipper registrieren
- `GET /api/clipper/[id]` - Clipper Daten abrufen
- `POST /api/video/upload` - Video hochladen
- `POST /api/video/process` - Video verarbeiten
- `GET /api/video/[id]` - Video Details
- `GET /api/review/queue` - Review Queue abrufen
- `POST /api/review/approve/[id]` - Video approven
- `POST /api/review/reject/[id]` - Video rejecten
- `GET /api/stats` - Statistiken abrufen

## Testing

1. Registriere einen Test-Clipper
2. Lade ein Test-Video hoch
3. Lade das gleiche Video nochmal hoch → sollte rejected werden
4. Lade ein leicht modifiziertes Video hoch → sollte in Manual Review landen
5. Prüfe Admin Panel → Manual Review Queue sollte das Video zeigen

## Nächste Schritte

- [ ] View Count Tracking implementieren
- [ ] Bonus-Zahlungen basierend auf Views
- [ ] Export-Funktionalität für Zahlungen
- [ ] Erweiterte Duplikaterkennung
- [ ] Multi-Clipper Uploads
- [ ] Batch-Processing