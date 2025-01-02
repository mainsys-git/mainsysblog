# Astro Blog

Ein moderner Blog mit Code-inspiriertem Design, gebaut mit Astro und Tailwind CSS. Unterstützt Markdown-Posts, Bildupload und eine schöne Syntax-Hervorhebung.

## 🚀 Features

- 📝 Markdown-Posts mit Code-Syntax-Hervorhebung
- 🖼️ Bildupload via Drag & Drop, Dateiauswahl oder Einfügen
- 🎨 Code-inspiriertes, dunkles Design
- 🔍 Vollbild-Bildvorschau
- 🔒 Benutzerauthentifizierung
- 📱 Responsive Design

## 🛠️ Technologie-Stack

- [Astro](https://astro.build) - Web Framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org) - Typsicherheit
- [SQLite](https://www.sqlite.org) - Datenbank
- [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) - Datenbankverbindung
- [Sharp](https://sharp.pixelplumbing.com) - Bildverarbeitung
- [Shiki](https://shiki.matsu.io) - Syntax-Hervorhebung

## 📦 Installation

1. Repository klonen:
```bash
git clone [repository-url]
cd astro-blog
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. SQLite-Datenbank initialisieren:
```bash
npm run db:init
```

4. Entwicklungsserver starten:
```bash
npm run dev
```

5. Für Produktionsaufbau:
```bash
npm run build
```

## 🗄️ Umgebungsvariablen

Erstelle eine `.env`-Datei im Hauptverzeichnis:

```env
DATABASE_URL="db/blog.db"
JWT_SECRET="dein-geheimer-schlüssel"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="sicheres-passwort"
```

## 📁 Projektstruktur

```
/
├── db/                 # SQLite Datenbank
├── public/            # Statische Assets
├── src/
│   ├── components/    # UI Komponenten
│   ├── layouts/       # Seitenlayouts
│   ├── lib/          # Hilfsfunktionen
│   ├── pages/        # Seitenrouten
│   └── styles/       # Globale Styles
└── uploads/          # Hochgeladene Bilder
```

## 💻 Entwicklung

### Neue Posts erstellen

1. Im Admin-Bereich einloggen (`/admin`)
2. "Neuer Post" auswählen
3. Markdown-Editor nutzen für:
   - Text mit Markdown-Syntax
   - Code-Blöcke mit Syntax-Hervorhebung
   - Bilder via Drag & Drop

### Datenbank-Schema

Die SQLite-Datenbank enthält folgende Tabellen:

- `posts`: Blog-Posts
- `users`: Benutzerkonten
- `sessions`: Aktive Sitzungen

### API-Endpunkte

- `POST /api/auth/login`: Benutzeranmeldung
- `POST /api/upload/image`: Bildupload
- `GET/POST /api/posts`: Posts verwalten

## 🔒 Sicherheit

- Alle Passwörter werden gehasht gespeichert
- JWT für Authentifizierung
- Validierung aller Uploads
- XSS-Schutz implementiert
- CSRF-Token für Formulare

## 📝 Lizenz

MIT

## 🤝 Beitragen

1. Fork erstellen
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## ⚠️ Bekannte Probleme

- SQLite unterstützt keine gleichzeitigen Schreibzugriffe
- Große Bilder sollten vor dem Upload komprimiert werden

## 🙏 Danksagung

- Astro-Team für das großartige Framework
- Tailwind-Team für das CSS-Framework
- Alle Mitwirkenden und Benutzer
