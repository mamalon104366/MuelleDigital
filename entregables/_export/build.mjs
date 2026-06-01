// Convierte cada .md de la carpeta entregables/ a Word (.docx) en entregables/word/
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import HTMLtoDOCX from 'html-to-docx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..'); // entregables/
const outDir = join(srcDir, 'word');
await mkdir(outDir, { recursive: true });

const estilo = `
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1f2937; }
  h1 { color: #2c1e4f; } h2 { color: #523f72; } h3 { color: #3f315a; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #999999; padding: 5px; font-size: 10pt; text-align: left; }
  th { background: #ede9fd; }
  code { background: #f3f4f6; }
  pre { background: #f3f4f6; padding: 8px; border: 1px solid #e5e7eb; }
`;

const files = (await readdir(srcDir)).filter((f) => f.endsWith('.md'));

for (const f of files) {
  const md = await readFile(join(srcDir, f), 'utf8');
  const bodyHtml = marked.parse(md);
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${estilo}</style></head><body>${bodyHtml}</body></html>`;

  let out = await HTMLtoDOCX(html, null, {
    table: { row: { cantSplit: true } },
    footer: false,
    pageNumber: false,
  });
  // Normaliza a Buffer (según versión puede ser Buffer/ArrayBuffer/Blob)
  if (out?.arrayBuffer) out = Buffer.from(await out.arrayBuffer());
  else out = Buffer.from(out);

  const dest = join(outDir, basename(f, '.md') + '.docx');
  await writeFile(dest, out);
  console.log('✅', basename(dest));
}

console.log('\n📄 Documentos Word en:', outDir);
