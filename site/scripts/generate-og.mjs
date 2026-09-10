import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../public/og.jpg');

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0a0a0b"/>
  <circle cx="1050" cy="100" r="220" fill="#f59e0b" opacity="0.07"/>
  <circle cx="120" cy="560" r="180" fill="#f59e0b" opacity="0.05"/>

  <rect x="200" y="120" width="800" height="390" rx="16" fill="#141416" stroke="#27272a" stroke-width="2"/>
  <rect x="200" y="120" width="800" height="48" rx="16" fill="#1a1a1a"/>
  <rect x="200" y="152" width="800" height="16" fill="#1a1a1a"/>

  <circle cx="232" cy="144" r="8" fill="#ff5f57"/>
  <circle cx="256" cy="144" r="8" fill="#febc2e"/>
  <circle cx="280" cy="144" r="8" fill="#28c840"/>
  <text x="304" y="149" font-family="ui-monospace, monospace" font-size="16" fill="#a1a1aa">termilog</text>

  <text x="600" y="280" text-anchor="middle" font-family="system-ui, sans-serif" font-size="64" font-weight="700" fill="#fafafa">Termilog</text>
  <text x="600" y="340" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" fill="#a1a1aa">Journal in your terminal.</text>

  <text x="600" y="420" text-anchor="middle" font-family="ui-monospace, monospace" font-size="28" fill="#f59e0b">$</text>
  <text x="628" y="420" text-anchor="start" font-family="ui-monospace, monospace" font-size="28" fill="#a1a1aa"> termilog</text>

  <text x="600" y="470" text-anchor="middle" font-family="ui-monospace, monospace" font-size="18" fill="#22c55e">Opening journal...</text>
</svg>
`;

const buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
writeFileSync(outPath, buffer);
console.log(`Wrote ${outPath}`);
