// Genera la presentación PPTX de Muelle Digital (blanco + morado, logos oficiales).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pptxgen from 'pptxgenjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRES = path.join(__dirname, '..', 'presentacion');

const MORADO = '512888', MORADO2 = '7841D4', LAV = 'EDE9FD', LAV2 = 'F6F4FE', TINTA = '241A38', GRIS = '5B5570';
const FONT = 'Arial';

// ---- Cargar logos oficiales (SVG) como data URI ----
const SLUGS = ['react','vite','tailwindcss','openstreetmap','axios','nodedotjs','express','jsonwebtokens','stripe','postgresql','neon','vercel','git','github','swagger','clickup','maplibre'];
const logo = {};
async function cargarLogos() {
  await Promise.all(SLUGS.map(async (s) => {
    try {
      const r = await fetch(`https://cdn.simpleicons.org/${s}`);
      const svg = await r.text();
      logo[s] = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    } catch { logo[s] = null; }
  }));
}
const muelle = 'data:image/png;base64,' + fs.readFileSync(path.join(PRES, 'logomuelle.png')).toString('base64');
let qr = null;
async function cargarQR() {
  try {
    const r = await fetch('https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=512888&data=https://muelle-digital.vercel.app');
    const buf = Buffer.from(await r.arrayBuffer());
    qr = 'data:image/png;base64,' + buf.toString('base64');
  } catch {}
}

const pptx = new pptxgen();
pptx.defineLayout({ name: 'W', width: 13.33, height: 7.5 });
pptx.layout = 'W';
pptx.author = 'Equipo Muelle Digital';
pptx.title = 'Muelle Digital — Sustentación';

// ---- helpers ----
const titulo = (s, t) => {
  s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 0.5, w: 0.13, h: 0.62, fill: { color: MORADO2 } });
  s.addText(t, { x: 0.85, y: 0.45, w: 11.8, h: 0.7, fontFace: FONT, fontSize: 30, bold: true, color: MORADO });
};
const pie = (s) => {
  s.addImage({ data: muelle, x: 0.5, y: 7.0, w: 0.32, h: 0.32 });
  s.addText('Muelle Digital', { x: 0.85, y: 7.0, w: 3, h: 0.32, fontFace: FONT, fontSize: 9, color: MORADO, bold: true, valign: 'middle' });
};
const nueva = () => { const s = pptx.addSlide(); s.background = { color: 'FFFFFF' }; return s; };
// tarjeta (caja lavanda)
const card = (s, x, y, w, h, fill = LAV2) => s.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: 'E2DAFA', width: 1 } });
// logo + etiqueta
const logoCard = (s, slug, label, x, y, w = 1.7) => {
  card(s, x, y, w, 1.25);
  if (logo[slug]) s.addImage({ data: logo[slug], x: x + w / 2 - 0.32, y: y + 0.16, w: 0.64, h: 0.64 });
  s.addText(label, { x, y: y + 0.85, w, h: 0.3, align: 'center', fontFace: FONT, fontSize: 10, color: GRIS, bold: true });
};
const bullets = (s, items, x, y, w, h, fs = 16) =>
  s.addText(items.map((t) => ({ text: t, options: { bullet: { code: '2022', indent: 18 }, color: TINTA, breakLine: true } })),
    { x, y, w, h, fontFace: FONT, fontSize: fs, lineSpacingMultiple: 1.25, valign: 'top' });

// ¡Cargar logos y QR ANTES de construir las diapositivas!
await cargarLogos();
await cargarQR();

// ================= 1 PORTADA =================
let s = nueva();
s.addImage({ data: muelle, x: 6.0, y: 0.9, w: 1.33, h: 1.33 });
s.addText('Muelle Digital', { x: 0, y: 2.4, w: 13.33, h: 0.9, align: 'center', fontFace: FONT, fontSize: 48, bold: true, color: MORADO });
s.addText('Marketplace de experiencias ecoturísticas fluviales · Barrancabermeja', { x: 0, y: 3.3, w: 13.33, h: 0.5, align: 'center', fontFace: FONT, fontSize: 16, color: GRIS });
const team = [['Esteban Merlano', 'Líder · Backend · Despliegue'], ['Andres Rangel', 'Base de Datos'], ['Keyner Trujillo', 'Frontend'], ['Jhon Escobar', 'QA']];
team.forEach((m, i) => {
  const x = 1.0 + i * 2.95;
  card(s, x, 4.4, 2.7, 1.0, LAV);
  s.addText(m[0], { x, y: 4.5, w: 2.7, h: 0.4, align: 'center', fontFace: FONT, fontSize: 13, bold: true, color: MORADO });
  s.addText(m[1], { x, y: 4.9, w: 2.7, h: 0.4, align: 'center', fontFace: FONT, fontSize: 10, color: GRIS });
});
s.addText('Proyecto de Ingeniería de Software · Metodología SDD', { x: 0, y: 6.4, w: 13.33, h: 0.4, align: 'center', fontFace: FONT, fontSize: 12, color: MORADO2 });

// ================= 2 PROBLEMA =================
s = nueva(); titulo(s, 'El problema'); pie(s);
s.addText('El ecoturismo fluvial en Barrancabermeja se ofrece de forma INFORMAL:', { x: 0.85, y: 1.4, w: 11.6, h: 0.5, fontFace: FONT, fontSize: 18, color: TINTA });
bullets(s, [
  'No hay un canal centralizado para reservar.',
  'Precios poco claros y sin pagos digitales.',
  'Falta de confianza y reputación de los guías.',
  'Los turistas no saben a quién contactar.',
], 1.0, 2.2, 11.0, 3.5, 18);

// ================= 3 SOLUCIÓN =================
s = nueva(); titulo(s, 'La solución'); pie(s);
s.addText('Muelle Digital conecta turistas con guías y pescadores locales verificados:', { x: 0.85, y: 1.4, w: 11.6, h: 0.5, fontFace: FONT, fontSize: 18, color: TINTA });
const sol = [['🛶', 'Descubrir', 'Catálogo con filtros'], ['📅', 'Reservar', 'Control de cupos'], ['💳', 'Pagar', 'En línea con Stripe'], ['⭐', 'Calificar', 'Reseñas en vivo']];
sol.forEach((c, i) => {
  const x = 1.0 + i * 2.95;
  card(s, x, 2.3, 2.7, 2.2, LAV);
  s.addText(c[0], { x, y: 2.5, w: 2.7, h: 0.8, align: 'center', fontSize: 40 });
  s.addText(c[1], { x, y: 3.35, w: 2.7, h: 0.4, align: 'center', fontFace: FONT, fontSize: 15, bold: true, color: MORADO });
  s.addText(c[2], { x, y: 3.8, w: 2.7, h: 0.5, align: 'center', fontFace: FONT, fontSize: 11, color: GRIS });
});
s.addText('+ punto de encuentro geolocalizado en un mapa.', { x: 0.85, y: 5.0, w: 11.6, h: 0.4, fontFace: FONT, fontSize: 13, italic: true, color: GRIS });

// ================= 4 OBJETIVOS =================
s = nueva(); titulo(s, 'Objetivos'); pie(s);
card(s, 0.85, 1.4, 11.6, 1.1, LAV);
s.addText([{ text: 'General:  ', options: { bold: true, color: MORADO } }, { text: 'Desarrollar una plataforma web tipo marketplace para reservar y pagar experiencias ecoturísticas fluviales.', options: { color: TINTA } }], { x: 1.1, y: 1.5, w: 11.1, h: 0.9, fontFace: FONT, fontSize: 16, valign: 'middle' });
s.addText('Específicos', { x: 0.85, y: 2.7, w: 11, h: 0.4, fontFace: FONT, fontSize: 16, bold: true, color: MORADO2 });
bullets(s, [
  'Reservas digitales con control de cupos.',
  'Pagos en línea (Stripe) y métodos locales simulados.',
  'Sistema de reputación con reseñas en tiempo real.',
  'Geolocalización del punto de encuentro.',
  'Verificación de guías por el administrador.',
], 1.0, 3.2, 11.0, 3.2, 16);

// ================= 5 USUARIOS =================
s = nueva(); titulo(s, 'Usuarios y roles'); pie(s);
const us = [['🧳', 'Turista', 'Busca, reserva, paga y califica experiencias.'], ['🛶', 'Guía / Pescador', 'Publica experiencias y marca el punto de encuentro (previa verificación).'], ['🛡️', 'Administrador', 'Verifica guías y gestiona usuarios, experiencias y pagos.']];
us.forEach((c, i) => {
  const x = 0.85 + i * 3.95;
  card(s, x, 1.6, 3.7, 3.6);
  s.addText(c[0], { x, y: 1.9, w: 3.7, h: 0.9, align: 'center', fontSize: 44 });
  s.addText(c[1], { x, y: 2.9, w: 3.7, h: 0.5, align: 'center', fontFace: FONT, fontSize: 17, bold: true, color: MORADO });
  s.addText(c[2], { x: x + 0.2, y: 3.5, w: 3.3, h: 1.5, align: 'center', fontFace: FONT, fontSize: 12, color: GRIS });
});

// ================= 6 ARQUITECTURA =================
s = nueva(); titulo(s, 'Arquitectura del sistema'); pie(s);
const arch = [['Frontend', 'React · SPA', ['react', 'tailwindcss']], ['API REST', 'Node + Express · JWT', ['nodedotjs', 'express']], ['Base de datos', 'PostgreSQL · Neon', ['postgresql', 'neon']]];
arch.forEach((b, i) => {
  const x = 1.0 + i * 4.2;
  card(s, x, 2.2, 3.4, 2.4, LAV2);
  s.addShape(pptx.ShapeType.roundRect, { x, y: 2.2, w: 3.4, h: 2.4, rectRadius: 0.08, fill: { type: 'none' }, line: { color: MORADO2, width: 2 } });
  s.addText(b[0], { x, y: 2.5, w: 3.4, h: 0.5, align: 'center', fontFace: FONT, fontSize: 18, bold: true, color: MORADO });
  s.addText(b[1], { x, y: 3.05, w: 3.4, h: 0.4, align: 'center', fontFace: FONT, fontSize: 12, color: GRIS });
  b[2].forEach((sl, j) => { if (logo[sl]) s.addImage({ data: logo[sl], x: x + 1.0 + j * 0.7, y: 3.6, w: 0.55, h: 0.55 }); });
  if (i < 2) s.addText('➜', { x: x + 3.4, y: 3.0, w: 0.8, h: 0.8, align: 'center', fontSize: 28, color: MORADO2, bold: true });
});
s.addText('Autenticación con JWT en cada petición · Desplegado serverless en Vercel', { x: 0, y: 5.3, w: 13.33, h: 0.4, align: 'center', fontFace: FONT, fontSize: 13, color: GRIS });

// ================= 7 STACK =================
s = nueva(); titulo(s, 'Stack tecnológico'); pie(s);
const cat = (t, x, y) => s.addText(t.toUpperCase(), { x, y, w: 12, h: 0.3, fontFace: FONT, fontSize: 11, bold: true, color: MORADO2, charSpacing: 1 });
cat('Frontend', 0.85, 1.35);
[['react', 'React'], ['vite', 'Vite'], ['tailwindcss', 'Tailwind'], ['openstreetmap', 'MapLibre/OSM'], ['axios', 'Axios']].forEach((l, i) => logoCard(s, l[0], l[1], 0.85 + i * 2.4, 1.65, 2.2));
cat('Backend', 0.85, 3.15);
[['nodedotjs', 'Node.js'], ['express', 'Express'], ['jsonwebtokens', 'JWT'], ['stripe', 'Stripe']].forEach((l, i) => logoCard(s, l[0], l[1], 0.85 + i * 2.4, 3.45, 2.2));
cat('Base de datos y despliegue', 0.85, 4.95);
[['postgresql', 'PostgreSQL'], ['neon', 'NeonDB'], ['vercel', 'Vercel'], ['github', 'GitHub'], ['swagger', 'Swagger'], ['clickup', 'ClickUp']].forEach((l, i) => logoCard(s, l[0], l[1], 0.85 + i * 2.0, 5.25, 1.85));

// ================= 8 MODELO DE DATOS =================
s = nueva(); titulo(s, 'Modelo de datos'); pie(s);
s.addText('PostgreSQL (Neon) · 6 tablas · normalizado a 3FN · integridad referencial', { x: 0.85, y: 1.35, w: 11.6, h: 0.4, fontFace: FONT, fontSize: 14, color: GRIS });
const ent = [['usuarios', 'turista / guía / admin'], ['experiencias', 'precio, cupos, lat/lng, Stripe'], ['reservas', 'fecha, personas, estado'], ['ratings', 'puntuación 1–5, comentario'], ['pagos', 'método, valor, estado'], ['solicitudes_guia', 'verificación de guías']];
ent.forEach((e, i) => {
  const x = 0.85 + (i % 3) * 4.0, y = 2.0 + Math.floor(i / 3) * 1.6;
  card(s, x, y, 3.7, 1.35);
  s.addText(e[0], { x: x + 0.2, y: y + 0.15, w: 3.3, h: 0.4, fontFace: FONT, fontSize: 15, bold: true, color: MORADO });
  s.addText(e[1], { x: x + 0.2, y: y + 0.6, w: 3.3, h: 0.6, fontFace: FONT, fontSize: 11, color: GRIS });
});
s.addText('usuarios 1—N experiencias · experiencias 1—N reservas · reservas 1—N pagos', { x: 0, y: 5.7, w: 13.33, h: 0.4, align: 'center', fontFace: FONT, fontSize: 12, italic: true, color: MORADO2 });

// ================= 9 FUNCIONALIDADES =================
s = nueva(); titulo(s, 'Funcionalidades clave'); pie(s);
const feats = [['🔎', 'Catálogo con filtros', 'Vista lista + detalle'], ['📅', 'Reservas', 'Con control de cupos'], ['⭐', 'Reseñas en tiempo real', 'Calificación 1–5'], ['🗺️', 'Mapa del punto de encuentro', 'El guía lo marca'], ['🛶', 'Panel del guía', 'Publica y gestiona'], ['🛡️', 'Panel admin', 'Control total + métricas']];
feats.forEach((f, i) => {
  const x = 0.85 + (i % 2) * 6.0, y = 1.5 + Math.floor(i / 2) * 1.7;
  card(s, x, y, 5.6, 1.45);
  s.addText(f[0], { x: x + 0.15, y: y + 0.3, w: 0.9, h: 0.9, fontSize: 30, align: 'center' });
  s.addText(f[1], { x: x + 1.1, y: y + 0.22, w: 4.3, h: 0.5, fontFace: FONT, fontSize: 15, bold: true, color: MORADO });
  s.addText(f[2], { x: x + 1.1, y: y + 0.72, w: 4.3, h: 0.5, fontFace: FONT, fontSize: 11, color: GRIS });
});

// ================= 10 PAGOS =================
s = nueva(); titulo(s, 'Pagos con Stripe'); pie(s);
if (logo.stripe) s.addImage({ data: logo.stripe, x: 6.2, y: 1.35, w: 0.9, h: 0.45 });
const pasos = [['1', 'Al crear la experiencia se genera Producto + Precio en Stripe'], ['2', 'Al reservar se crea una Checkout Session'], ['3', 'Confirmación por webhook + verificación (idempotente)'], ['4', 'La reserva pasa a confirmada']];
pasos.forEach((p, i) => {
  const x = 0.85 + i * 3.0;
  card(s, x, 2.4, 2.8, 2.3);
  s.addShape(pptx.ShapeType.ellipse, { x: x + 1.15, y: 2.65, w: 0.55, h: 0.55, fill: { color: MORADO } });
  s.addText(p[0], { x: x + 1.15, y: 2.65, w: 0.55, h: 0.55, align: 'center', valign: 'middle', fontFace: FONT, fontSize: 18, bold: true, color: 'FFFFFF' });
  s.addText(p[1], { x: x + 0.2, y: 3.35, w: 2.4, h: 1.2, align: 'center', fontFace: FONT, fontSize: 12, color: GRIS });
});
s.addText('Modo de prueba · preparado para comisiones por guía (marketplace)', { x: 0, y: 5.2, w: 13.33, h: 0.4, align: 'center', fontFace: FONT, fontSize: 12, italic: true, color: GRIS });

// ================= 11 MAPAS =================
s = nueva(); titulo(s, 'Mapas — punto de encuentro'); pie(s);
bullets(s, ['El guía marca el punto en el mapa al publicar.', 'El turista lo visualiza en la oferta.', 'El admin ve todos los puntos en un mapa global.', 'Tecnología gratis y sin API key.'], 0.95, 2.0, 6.5, 3.0, 17);
card(s, 8.0, 1.9, 4.3, 3.2, LAV);
s.addText('📍🗺️', { x: 8.0, y: 2.3, w: 4.3, h: 1.2, align: 'center', fontSize: 54 });
if (logo.maplibre) s.addImage({ data: logo.maplibre, x: 9.4, y: 3.7, w: 0.7, h: 0.7 });
if (logo.openstreetmap) s.addImage({ data: logo.openstreetmap, x: 10.3, y: 3.7, w: 0.7, h: 0.7 });
s.addText('MapLibre GL + OpenStreetMap', { x: 8.0, y: 4.5, w: 4.3, h: 0.4, align: 'center', fontFace: FONT, fontSize: 12, color: GRIS });

// ================= 12 SEGURIDAD =================
s = nueva(); titulo(s, 'Seguridad'); pie(s);
bullets(s, ['Contraseñas cifradas con bcrypt.', 'Autenticación JWT por rol.', 'Acceso restringido (turista/guía/admin).'], 0.95, 1.7, 5.8, 2.5, 16);
bullets(s, ['Claves en variables de entorno (no en el código).', 'Consultas parametrizadas (anti SQL injection).', 'Conexión SSL a la base de datos.'], 6.9, 1.7, 5.8, 2.5, 16);
s.addShape(pptx.ShapeType.roundRect, { x: 3.4, y: 4.6, w: 6.5, h: 0.8, rectRadius: 0.4, fill: { color: MORADO } });
s.addText('🔒  El rol "guía" solo lo aprueba el administrador', { x: 3.4, y: 4.6, w: 6.5, h: 0.8, align: 'center', valign: 'middle', fontFace: FONT, fontSize: 14, bold: true, color: 'FFFFFF' });

// ================= 13 METODOLOGÍA =================
s = nueva(); titulo(s, 'Metodología y gestión'); pie(s);
const met = [['SDD', 'Spec-Driven: especificar antes de programar, con trazabilidad.'], ['Sprints', '8 semanas: definición, arquitectura, 4 sprints, QA y entrega.'], ['GitFlow', 'Ramas por rol + develop + producción, con Pull Requests.']];
met.forEach((m, i) => {
  const x = 0.85 + i * 4.0;
  card(s, x, 1.6, 3.7, 2.2, LAV);
  s.addText(m[0], { x, y: 1.8, w: 3.7, h: 0.5, align: 'center', fontFace: FONT, fontSize: 18, bold: true, color: MORADO });
  s.addText(m[1], { x: x + 0.2, y: 2.4, w: 3.3, h: 1.3, align: 'center', fontFace: FONT, fontSize: 12, color: GRIS });
});
['git', 'github', 'clickup'].forEach((sl, i) => { if (logo[sl]) s.addImage({ data: logo[sl], x: 5.4 + i * 1.1, y: 4.3, w: 0.7, h: 0.7 }); });

// ================= 14 EQUIPO =================
s = nueva(); titulo(s, 'El equipo'); pie(s);
const eq = [['🎯 Esteban Merlano', 'Líder del proyecto, desarrollo del backend/API, integración y despliegue a producción.'], ['🗄️ Andres Rangel', 'Diseño del modelo de datos, normalización, seguridad e integridad de la información.'], ['🎨 Keyner Trujillo', 'Desarrollo del frontend en React, UX/UI y consumo de la API.'], ['🧪 Jhon Escobar', 'Aseguramiento de calidad: plan de pruebas, seguridad y revisión de código.']];
eq.forEach((m, i) => {
  const x = 0.85 + (i % 2) * 6.0, y = 1.6 + Math.floor(i / 2) * 2.0;
  card(s, x, y, 5.6, 1.75);
  s.addText(m[0], { x: x + 0.2, y: y + 0.2, w: 5.2, h: 0.5, fontFace: FONT, fontSize: 16, bold: true, color: MORADO });
  s.addText(m[1], { x: x + 0.2, y: y + 0.7, w: 5.2, h: 0.95, fontFace: FONT, fontSize: 12, color: GRIS });
});

// ================= 15 QA =================
s = nueva(); titulo(s, 'Calidad y pruebas'); pie(s);
const qa = [['22', 'casos de prueba (15 funcionales + 7 de seguridad)'], ['3', 'bugs encontrados y corregidos'], ['100%', 'casos exitosos tras correcciones']];
qa.forEach((q, i) => {
  const x = 0.85 + i * 4.0;
  card(s, x, 1.9, 3.7, 2.6);
  s.addText(q[0], { x, y: 2.2, w: 3.7, h: 1.0, align: 'center', fontFace: FONT, fontSize: 44, bold: true, color: MORADO });
  s.addText(q[1], { x: x + 0.2, y: 3.3, w: 3.3, h: 1.0, align: 'center', fontFace: FONT, fontSize: 12, color: GRIS });
});
s.addText('Revisión de código por Pull Requests antes de integrar.', { x: 0, y: 5.0, w: 13.33, h: 0.4, align: 'center', fontFace: FONT, fontSize: 13, italic: true, color: GRIS });

// ================= 16 DESPLIEGUE =================
s = nueva(); titulo(s, 'Despliegue — ¡en producción!'); pie(s);
['vercel', 'neon'].forEach((sl, i) => { if (logo[sl]) s.addImage({ data: logo[sl], x: 0.95 + i * 0.9, y: 1.5, w: 0.65, h: 0.65 }); });
s.addText('Vercel + NeonDB', { x: 2.8, y: 1.6, w: 4, h: 0.5, fontFace: FONT, fontSize: 14, color: GRIS, valign: 'middle' });
bullets(s, ['App:  muelle-digital.vercel.app', 'API:  muelle-digital-api.vercel.app', 'Variables de entorno cifradas.'], 0.95, 2.6, 7.0, 2.5, 17);
if (qr) { s.addImage({ data: qr, x: 9.5, y: 2.2, w: 2.6, h: 2.6 }); s.addText('Escanea y pruébalo en vivo', { x: 9.0, y: 4.85, w: 3.6, h: 0.4, align: 'center', fontFace: FONT, fontSize: 11, color: GRIS }); }

// ================= 17 RESULTADOS =================
s = nueva(); titulo(s, 'Resultados y trabajo futuro'); pie(s);
card(s, 0.85, 1.7, 5.6, 3.0, LAV);
s.addText('✅ Resultados', { x: 1.05, y: 1.9, w: 5.2, h: 0.5, fontFace: FONT, fontSize: 16, bold: true, color: MORADO });
bullets(s, ['13/13 historias de usuario implementadas.', 'Producto funcional y desplegado.', 'Pagos y mapas operativos.'], 1.15, 2.5, 5.1, 2.0, 13);
card(s, 6.85, 1.7, 5.6, 3.0, LAV);
s.addText('🚀 Trabajo futuro', { x: 7.05, y: 1.9, w: 5.2, h: 0.5, fontFace: FONT, fontSize: 16, bold: true, color: MORADO });
bullets(s, ['Stripe Connect (comisiones por guía).', 'Pruebas automatizadas (CI/CD).', 'Aplicación móvil.'], 7.15, 2.5, 5.1, 2.0, 13);

// ================= 18 GRACIAS =================
s = pptx.addSlide(); s.background = { color: MORADO };
s.addImage({ data: muelle, x: 6.16, y: 1.4, w: 1.0, h: 1.0 });
s.addText('¡Gracias!', { x: 0, y: 2.6, w: 13.33, h: 1.0, align: 'center', fontFace: FONT, fontSize: 48, bold: true, color: 'FFFFFF' });
s.addText('Muelle Digital — un producto real, funcional y desplegado.', { x: 0, y: 3.7, w: 13.33, h: 0.5, align: 'center', fontFace: FONT, fontSize: 16, color: 'E9E2FB' });
s.addText('muelle-digital.vercel.app', { x: 0, y: 4.3, w: 13.33, h: 0.5, align: 'center', fontFace: FONT, fontSize: 16, bold: true, color: 'C9B8F5' });
s.addText('Esteban Merlano · Andres Rangel · Keyner Trujillo · Jhon Escobar', { x: 0, y: 5.5, w: 13.33, h: 0.4, align: 'center', fontFace: FONT, fontSize: 12, color: 'B9A7E8' });

// ---- guardar ----
const out = process.argv[2] || path.join(PRES, 'Muelle-Digital-Presentacion.pptx');
await pptx.writeFile({ fileName: out });
console.log('✅ PPTX generado:', out, '| logos cargados:', Object.values(logo).filter(Boolean).length + '/' + SLUGS.length, '| QR:', qr ? 'sí' : 'no');
