# GridIron IQ — Brand- & Kampagnen-Assets

> **Stand:** 2026-09-16 · Repo: `gridironiq-beta` · Landing: https://nuebelm.github.io/gridironiq-beta/

Interne Notiz: welche Datei in `assets/` wofür gedacht ist, was live auf der Website hängt und was für spätere Kampagnen aufbewahrt wird.

---

## Kurzüberblick

| Datei | Größe | Website (live) | Kampagnen / später |
|-------|-------|------------------|-------------------|
| `hero1.jpg` | 1536×1024 | **Hero-Banner** (`index.html`) | Optional in breiten Mail-Headern |
| `teaser.jpg` | 1024×1024 | **Open Graph / Twitter Card** (Link-Vorschau) | WhatsApp, Discord, Instagram, Play-Store-Style |
| `background.jpg` | 1248×832 | *(nicht aktiv)* | App-Hintergrund, alternative Hero-Variante |
| `icon.png` | 1024×1024 | Favicon, Hero-Logo, Header | Überall als Marken-Icon |
| `Home*.jpg` … `settings*.jpg` | ~1080×2340 | Screenshot-Galerie | Store-Listing, Social „Feature“-Posts |
| `TradeBoard2.jpg` | 1080×2340 | Galerie (Trade Board) | Trade-Themen-Kampagnen |

**Entfernt:** `TradeBoard1.jpg` — fehlerhafter Export (Duplikat Scouting + weißer Rand). Nicht wiederverwenden.

---

## Hero vs. Teaser

### `hero1.jpg` — Landing Hero ✅

- Querformat, Spielfeld + HUD — passt zu `background-size: cover` im Hero.
- AI-Wasserzeichen entfernt (Ecke oben rechts gepatcht + leichter CSS-Gradient).
- **Nicht ersetzen** durch `teaser.jpg` (Quadrat würde auf Desktop stark beschneiden).

### `teaser.jpg` — Social & Link-Vorschau ✅

- Quadrat mit **„GRIDIRON IQ“**-Schriftzug — starkes Branding, weniger „Atmosphäre“.
- AI-Wasserzeichen entfernt (Ecke oben rechts).
- In `index.html`: `og:image`, `twitter:image`.
- **Nicht** als Hero — doppeltes Branding + falsches Seitenverhältnis.

### `background.jpg` — Reserve

- Original-App-Hintergrund (50-Yard-Line, dezenter).
- War kurz als Hero im Einsatz; durch `hero1.jpg` ersetzt.
- Behalten für: einheitlicher Look mit App-UI, A/B-Tests, spätere „ruhigere“ Hero-Variante.

---

## App-Screenshots (Galerie)

Standard für neue Exports: **1080×2340 px** (Portrait, kein extra Canvas).

| Datei | Caption (DE) | Hinweis |
|-------|--------------|---------|
| `Home1.jpg` / `Home2.jpg` | Liga-Übersicht | |
| `Details1.jpg` / `Details2.jpg` | Spielerdetail | |
| `ScoutingCenter.jpg` | Notes & Scouting | |
| `TradeBoard2.jpg` | Trade Board | Einziger Trade-Screenshot |
| `Injury1–3.jpg`, `injury4.jpg` | Injury Matrix | `Injury1` leicht schmaler (1019 px) — OK |
| `exposure1.jpg` / `exposure2.jpg` | Exposure | |
| `settings1–3.jpg` | Einstellungen | |

**Export-Tipps:** Kein weißes Padding rechts/links · Roster-Spalte vollständig im Bild · Dateiname = Feature.

---

## Empfohlene Größen (neue Assets)

| Kanal | Format | Notiz |
|-------|--------|-------|
| Landing Hero | ≥ 1440×600 (3:1 bis 3:2) | Wie `hero1.jpg` |
| OG / Social Teaser | 1200×1200 oder 1024×1024 | Wie `teaser.jpg` |
| WhatsApp-Link | nutzt OG-Image | `teaser.jpg` testen nach Deploy |
| Play Feature Graphic | 1024×500 | Aus `teaser` + Text neu layouten |
| App-Screenshots | 1080×2340 | Galerie + Store später |

---

## Wasserzeichen (AI-generiert)

Bei Generator-Exporten („Made with AI“):

1. **Bevorzugt:** ohne Wasserzeichen exportieren (Paid / Einstellung).
2. **Sonst:** Ecke oben rechts patchen (siehe Git-History `hero1`, `teaser`) oder in Figma/Photoshop inpainten.
3. **Notfall:** CSS-Gradient über Ecke — nur für Web-Hintergründe, nicht für Store-Assets.

---

## Website-Referenz (`index.html`)

| Element | Asset / Anker |
|---------|----------------|
| Hero-Hintergrund | `assets/hero1.jpg` |
| OG-Preview | `assets/teaser.jpg` |
| Galerie | Karussell, 16 JPGs |
| Nav | `#top`, `#download`, `#install`, `#preview`, `#feedback` |

Runbook (App-Repo): `my-fantasy-app/docs/ops/28-closed-beta-program.md`

---

## Checkliste neues Beta-Build

- [ ] APK + SHA-256 in `index.html` und Release Notes
- [ ] `changelog.meta` / Bullets in Landing aktualisieren
- [ ] OG-URL nach Push testen (WhatsApp, Discord, iMessage)
- [ ] Neue Screenshots: 1080×2340, ohne Rand, in Galerie eintragen
