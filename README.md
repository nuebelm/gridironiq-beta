# GridIron IQ — Closed Beta

Public landing page and APK releases for the GridIron IQ closed beta (Android sideload).

- **Landing:** https://nuebelm.github.io/gridironiq-beta/
- **Privacy:** https://nuebelm.github.io/gridironiq-privacy/
- **App source:** private repository (not published here)

## Contents

| File | Purpose |
|------|---------|
| `index.html` | Beta landing page (DE/EN) |
| `guide/*.html` | Public Quick Start + User Manual (DE/EN) |
| `scripts/build-guide.mjs` | Regenerate `guide/` from private `fantasynotebook` docs |
| `assets/install-*.svg` | Sideload step illustrations |
| `assets/icon.png` | App logo |
| `assets/hero1.jpg` | Hero banner background |
| `assets/teaser.jpg` | Open Graph / social link preview |
| Releases | APK downloads (`app-release.apk`) |

## Maintainer

Upload new beta builds via GitHub Releases. Update the SHA-256 in `index.html` when the APK changes.

Regenerate user docs after editing `my-fantasy-app/docs/quickstart/` or `user-guide/`:

```bash
node scripts/build-guide.mjs
```
