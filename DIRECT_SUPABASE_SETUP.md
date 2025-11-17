# Direkte Supabase-Integration (ohne Prisma)

## 1. SQL-Tabellen in Supabase erstellen

1. Gehe zu deinem Supabase Dashboard: https://supabase.com/dashboard/project/rryxeeauhrqsuyvugbwu
2. Klicke auf **SQL Editor** im Seitenmenü
3. Erstelle eine **New query**
4. Kopiere den Inhalt aus `supabase-setup.sql` und führe ihn aus

## 2. Dependencies aktualisieren

```bash
npm install @supabase/supabase-js
```

## 3. API-Endpoints auf Supabase umstellen

Die Dateien in `app/api/` können die `SupabaseDB` Klasse aus `lib/supabase-client.ts` verwenden:

```typescript
import { SupabaseDB } from '@/lib/supabase-client'

// Statt Prisma:
const video = await SupabaseDB.createVideo({
  clipperId,
  videoLink,
  platform
})
```

## 4. Warum ohne Prisma?

**Vorteile der direkten Supabase-Integration:**

- ✅ **Einfacher**: Keine zusätzliche ORM-Schicht
- ✅ **Performanter**: Direkte SQL-Queries
- ✅ **Flexibler**: Vollzugriff auf PostgreSQL Features
- ✅ **Weniger Dependencies**: Kleineres Bundle
- ✅ **Real-time**: Supabase Subscriptions möglich

**Prisma Vorteile:**

- ✅ Type-Safety
- ✅ Schema-Migration Management
- ✅ Entwickler-Experience

## 5. Empfohlene Struktur

### Für einfache Projekte: Direkte Supabase
```
lib/supabase-client.ts  # Helper functions
app/api/*/route.ts      # Verwende SupabaseDB
```

### Für komplexe Projekte: Prisma + Supabase
```
prisma/schema.prisma    # Schema definition
lib/db.ts              # Prisma client
app/api/*/route.ts      # Verwende Prisma
```

## 6. Aktuelle .env.local verwenden

Deine `.env.local` ist bereits korrekt konfiguriert:
```env
NEXT_PUBLIC_SUPABASE_URL=https://rryxeeauhrqsuyvugbwu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 7. Anwendung starten

```bash
npm install
npm run dev
```

## 8. Optional: Prisma entfernen

Falls du nur Supabase direkt verwenden möchtest:

```bash
npm uninstall prisma @prisma/client
rm -rf prisma/
```

Dann die API-Routen auf `SupabaseDB` umstellen.

## Empfehlung

Für ClipLink empfehle ich **direkte Supabase-Integration**, da:
- Das System relativ einfach ist
- Performance wichtig ist (Video-Metadaten)
- Weniger Komplexität gewünscht ist