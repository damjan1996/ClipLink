# Supabase Setup für ClipLink

## 1. Datenbank-Passwort einrichten

1. Gehe zu deinem Supabase Dashboard: https://supabase.com/dashboard/project/rryxeeauhrqsuyvugbwu
2. Navigiere zu Settings → Database
3. Kopiere dein Datenbank-Passwort
4. Öffne die `.env.local` Datei und ersetze `[YOUR-PASSWORD]` mit deinem tatsächlichen Passwort:
   ```
   DATABASE_URL=postgresql://postgres:DEIN-PASSWORT-HIER@db.rryxeeauhrqsuyvugbwu.supabase.co:5432/postgres
   DIRECT_URL=postgresql://postgres:DEIN-PASSWORT-HIER@db.rryxeeauhrqsuyvugbwu.supabase.co:5432/postgres
   ```

## 2. Dependencies installieren

```bash
npm install
```

## 3. Datenbank migrieren

```bash
# Prisma Client generieren
npx prisma generate

# Datenbank-Schema erstellen
npx prisma migrate deploy

# Alternative: Wenn die Migration fehlschlägt, verwende:
npx prisma db push
```

## 4. Initiale Daten einrichten

```bash
node scripts/setup-supabase.js
```

Dies erstellt:
- Admin-Benutzer: username=`admin`, password=`admin123`
- Test-Clipper: email=`test@clipper.com`, password=`test123`
- Standard-Einstellungen

## 5. Anwendung starten

```bash
npm run dev
```

Die Anwendung läuft jetzt unter http://localhost:3000

## 6. Playwright für Web-Scraping installieren

```bash
npx playwright install chromium
```

## Wichtige URLs

- **Anwendung**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Supabase Dashboard**: https://supabase.com/dashboard/project/rryxeeauhrqsuyvugbwu

## Fehlerbehebung

### "Invalid database URL" Fehler
- Stelle sicher, dass du dein Datenbank-Passwort in `.env.local` eingetragen hast
- Das Passwort darf keine Sonderzeichen wie `@` oder `:` enthalten, oder muss URL-encoded werden

### Migration fehlgeschlagen
- Verwende `npx prisma db push` statt `migrate deploy`
- Überprüfe die Datenbank-Verbindung im Supabase Dashboard

### Playwright Fehler
- Installiere Playwright mit: `npx playwright install-deps`
- Auf Windows: Führe PowerShell als Administrator aus