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
git clone https://github.com/mainsys-git/mainsysblog.git
cd mainsysblog
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Umgebungsvariablen einrichten:
   - Kopiere `.env.example` zu `.env`
   - Passe die Werte in `.env` an:
     ```env
     # Authentication
     JWT_SECRET="dein-geheimer-schlüssel"  # Wichtig für die Sicherheit!
     
     # Server Configuration
     BASE_URL="http://localhost:4321"      # URL deiner Anwendung
     ```

4. Datenbank initialisieren:
```bash
npm run db:init
```

5. Entwicklungsserver starten:
```bash
npm run dev
```

Der Blog ist jetzt unter `http://localhost:3000` erreichbar!

## 🤝 Beitragen

Wir freuen uns über Beiträge! So kannst du mitmachen:

### 1. Entwicklungsumgebung einrichten

```bash
# Repository forken und klonen
git clone https://github.com/[dein-username]/mainsysblog.git
cd mainsysblog

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

### 2. Änderungen vornehmen

1. Erstelle einen Feature-Branch:
```bash
git checkout -b feature/deine-feature-beschreibung
```

2. Entwickle dein Feature:
   - Halte dich an den existierenden Code-Stil
   - Füge Kommentare für komplexe Logik hinzu
   - Teste deine Änderungen gründlich

3. Committe deine Änderungen:
```bash
git add .
git commit -m "feat: Beschreibung deiner Änderungen"
```

### 3. Pull Request erstellen

1. Pushe zu deinem Fork:
```bash
git push origin feature/deine-feature-beschreibung
```

2. Erstelle einen Pull Request:
   - Gehe zu GitHub
   - Klicke auf "Pull Request"
   - Beschreibe deine Änderungen detailliert
   - Verlinke relevante Issues

### 4. Code-Richtlinien

- Nutze TypeScript für neue Funktionen
- Folge dem existierenden Code-Stil
- Schreibe aussagekräftige Commit-Messages
- Dokumentiere neue Funktionen
- Teste deine Änderungen

## ⚠️ Bekannte Probleme

- SQLite unterstützt keine gleichzeitigen Schreibzugriffe
- Große Bilder sollten vor dem Upload komprimiert werden

## 🔒 Sicherheit

- Alle Passwörter werden gehasht gespeichert
- JWT für Authentifizierung
- Validierung aller Uploads
- XSS-Schutz implementiert
- CSRF-Token für Formulare

## 📝 Lizenz

[MIT](LICENSE)

## 🙏 Danksagung

- Astro-Team für das großartige Framework
- Tailwind-Team für das CSS-Framework
- Alle Mitwirkenden und Benutzer
