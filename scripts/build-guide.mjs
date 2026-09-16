/**
 * Generate public guide HTML from private fantasynotebook docs.
 * Run: node scripts/build-guide.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.resolve(ROOT, '..', 'my-fantasy-app', 'docs');
const OUT_DIR = path.join(ROOT, 'guide');

const FILES = [
  { src: 'quickstart/de.md', out: 'quickstart-de.html', lang: 'de', title: 'Quick Start' },
  { src: 'quickstart/en.md', out: 'quickstart-en.html', lang: 'en', title: 'Quick Start' },
  { src: 'user-guide/de-manual.md', out: 'manual-de.html', lang: 'de', title: 'Benutzerhandbuch' },
  { src: 'user-guide/en-manual.md', out: 'manual-en.html', lang: 'en', title: 'User Manual' },
];

const BETA_BANNER = {
  de: '<p class="doc-beta"><strong>Closed Beta:</strong> APK nur von dieser Landing Page. <strong>Neue Konten starten als Free</strong> — Pro erst nach E-Mail mit Benutzernamen an <a href="mailto:support@gridiron-iq.de">support@gridiron-iq.de</a> (manuell, meist &lt;24 h).</p>',
  en: '<p class="doc-beta"><strong>Closed beta:</strong> Download the APK only from this landing page. <strong>New accounts start on Free</strong> — Pro only after you email your username to <a href="mailto:support@gridiron-iq.de">support@gridiron-iq.de</a> (manual activation, usually &lt;24h).</p>',
};

function rewriteLinks(markdown) {
  return markdown
    .replace(/\[([^\]]+)\]\((?:\.\.\/){1,2}(?:engineering|ops|project-plan|qa|design|legal)\/[^)]+\)/g, '$1')
    .replace(/```mermaid[\s\S]*?```/g, (block) => {
      const lines = block
        .replace(/```mermaid\n?/, '')
        .replace(/```$/, '')
        .trim()
        .split('\n')
        .filter((line) => line.includes('-->'))
        .map((line) => line.replace(/\s*-->\s*/g, ' → ').replace(/\[|\]/g, ''))
        .join(' · ');
      return lines ? `\n> **Flow:** ${lines}\n` : '';
    })
    .replace(/\]\(\.\.\/user-guide\/de-manual\.md([^)]*)\)/g, '](manual-de.html$1)')
    .replace(/\]\(\.\.\/user-guide\/en-manual\.md([^)]*)\)/g, '](manual-en.html$1)')
    .replace(/\]\(\.\.\/quickstart\/de\.md([^)]*)\)/g, '](quickstart-de.html$1)')
    .replace(/\]\(\.\.\/quickstart\/en\.md([^)]*)\)/g, '](quickstart-en.html$1)')
    .replace(/\]\(de-manual\.md([^)]*)\)/g, '](manual-de.html$1)')
    .replace(/\]\(en-manual\.md([^)]*)\)/g, '](manual-en.html$1)')
    .replace(/\]\(de\.md([^)]*)\)/g, '](quickstart-de.html$1)')
    .replace(/\]\(en\.md([^)]*)\)/g, '](quickstart-en.html$1)');
}

function githubHeadingSlug(text) {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/\(([^)]*)\)/g, ' $1 ')
    .toLowerCase()
    .normalize('NFC')
    .replace(/\s*&\s*/g, '--')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .trim()
    .replace(/\s+/g, '-');
}

function slugify(text) {
  return githubHeadingSlug(text);
}

function inline(text) {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function parseTable(lines) {
  const rows = lines.map((line) =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim()),
  );
  const header = rows[0];
  const body = rows.slice(2);
  let html = '<table><thead><tr>';
  header.forEach((cell) => {
    html += `<th>${inline(cell)}</th>`;
  });
  html += '</tr></thead><tbody>';
  body.forEach((row) => {
    html += '<tr>';
    row.forEach((cell) => {
      html += `<td>${inline(cell)}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  const slugCounts = new Map();
  let i = 0;

  function nextHeadingId(title) {
    const base = githubHeadingSlug(title);
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  }

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      out.push('<hr>');
      i += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const rawTitle = heading[2];
      const text = inline(rawTitle);
      const id = nextHeadingId(rawTitle);
      out.push(`<h${level} id="${id}">${text}</h${level}>`);
      i += 1;
      continue;
    }

    if (line.startsWith('> ')) {
      const quoteLines = [];
      while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      out.push(`<blockquote><p>${inline(quoteLines.join(' '))}</p></blockquote>`);
      continue;
    }

    if (line.includes('|') && i + 1 < lines.length && /^\|?[-:| ]+\|/.test(lines[i + 1])) {
      const tableLines = [line];
      i += 1;
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i += 1;
      }
      out.push(parseTable(tableLines));
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      out.push('<ol>');
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        out.push(`<li>${inline(lines[i].replace(/^\d+\.\s+/, ''))}</li>`);
        i += 1;
      }
      out.push('</ol>');
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      out.push('<ul>');
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        out.push(`<li>${inline(lines[i].replace(/^[-*]\s+/, ''))}</li>`);
        i += 1;
      }
      out.push('</ul>');
      continue;
    }

    const para = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}|>|[-*]|\d+\.|\|---)/.test(lines[i]) && !(lines[i].includes('|') && i + 1 < lines.length && /^\|?[-:| ]+\|/.test(lines[i + 1]))) {
      para.push(lines[i]);
      i += 1;
    }
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }

  return out.join('\n');
}

function wrapPage({ lang, title, body, siblings }) {
  const home = '../index.html';
  const langSwitch =
    lang === 'de'
      ? '<a href="quickstart-en.html">English</a> · <a href="manual-de.html">Handbuch</a>'
      : '<a href="quickstart-de.html">Deutsch</a> · <a href="manual-en.html">Manual</a>';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index,follow">
  <title>GridIron IQ — ${title}</title>
  <link rel="icon" href="../assets/icon.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="doc.css">
</head>
<body>
  <header class="doc-header">
    <div class="doc-header-inner">
      <a class="doc-brand" href="${home}">
        <img src="../assets/icon.png" alt="" width="36" height="36">
        <span>GridIron IQ</span>
      </a>
      <nav class="doc-nav">${langSwitch} · <a href="${home}#download">APK</a></nav>
    </div>
  </header>
  <main class="doc-main">
    <article class="doc-article">
      ${BETA_BANNER[lang]}
      ${body}
    </article>
    <aside class="doc-aside">
      <p><strong>${lang === 'de' ? 'Weiter' : 'More'}</strong></p>
      <ul>${siblings.map((s) => `<li><a href="${s.out}">${s.label}</a></li>`).join('')}</ul>
      <p><a class="doc-back" href="${home}">← ${lang === 'de' ? 'Zur Beta-Landing' : 'Back to beta landing'}</a></p>
    </aside>
  </main>
  <footer class="doc-footer">
    <p>© 2026 GridIron IQ · <a href="https://nuebelm.github.io/gridironiq-privacy/">Privacy / Impressum</a></p>
  </footer>
</body>
</html>`;
}

const siblingLinks = {
  'quickstart-de.html': [
    { out: 'quickstart-en.html', label: 'Quick Start (English)' },
    { out: 'manual-de.html', label: 'Benutzerhandbuch' },
  ],
  'quickstart-en.html': [
    { out: 'quickstart-de.html', label: 'Quick Start (Deutsch)' },
    { out: 'manual-en.html', label: 'User Manual' },
  ],
  'manual-de.html': [
    { out: 'quickstart-de.html', label: 'Quick Start' },
    { out: 'manual-en.html', label: 'User Manual (English)' },
  ],
  'manual-en.html': [
    { out: 'quickstart-en.html', label: 'Quick Start' },
    { out: 'manual-de.html', label: 'Benutzerhandbuch (Deutsch)' },
  ],
};

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const file of FILES) {
  const sourcePath = path.join(SOURCE_ROOT, file.src);
  const raw = fs.readFileSync(sourcePath, 'utf8');
  const markdown = rewriteLinks(raw);
  const body = markdownToHtml(markdown);
  const html = wrapPage({
    lang: file.lang,
    title: file.title,
    body,
    siblings: siblingLinks[file.out],
  });
  fs.writeFileSync(path.join(OUT_DIR, file.out), html, 'utf8');
  console.log('Wrote', file.out);
}
