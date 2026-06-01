// Genera el GUION DE EXPOSICIÓN (proyecto de grado) — Muelle Digital.
// El texto en GRIS es lo que cada integrante debe DECIR/mostrar.
import fs from 'node:fs';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  LevelFormat, Footer, PageNumber, PageBreak, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
} from 'docx';

const MORADO = '512888';
const GRIS = '5E5E5E';
const GRIS2 = '8A8A8A';

const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const P = (t) => new Paragraph({ spacing: { after: 100 }, children: [new TextRun(t)] });
const FASE = (t) => new Paragraph({ spacing: { before: 150, after: 40 }, children: [new TextRun({ text: t, bold: true, color: MORADO })] });
const SAY = (t) => new Paragraph({ indent: { left: 360 }, spacing: { after: 70 }, children: [new TextRun({ text: '🗣  ' + t, color: GRIS })] });
const NOTA = (t) => new Paragraph({ indent: { left: 360 }, spacing: { after: 70 }, children: [new TextRun({ text: '👉 ' + t, color: GRIS2, italics: true })] });
const BL = (items) => items.map((t) => new Paragraph({ numbering: { reference: 'b', level: 0 }, spacing: { after: 50 }, children: [new TextRun(t)] }));

// tabla mapeo de roles
const b = { style: BorderStyle.SINGLE, size: 1, color: 'BBBBBB' };
const bd = { top: b, bottom: b, left: b, right: b };
const c = (t, w, head = false) => new TableCell({ borders: bd, width: { size: w, type: WidthType.DXA }, shading: head ? { fill: 'EDE9FD', type: ShadingType.CLEAR } : undefined, margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: t, bold: head })] })] });
const row = (a, x, y, head = false) => new TableRow({ children: [c(a, 2600, head), c(x, 3400, head), c(y, 3360, head)] });
const tablaRoles = new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [2600, 3400, 3360], rows: [
  row('Integrante', 'Rol en el equipo', 'Roles de la guía que cubre', true),
  row('Esteban Merlano', 'Líder + Backend + Despliegue', 'Líder de Proyecto · Ingeniero de Software · DevOps'),
  row('Andres Rangel', 'Base de Datos', 'Ingeniero de Software (datos) · parte de Especificación'),
  row('Keyner Trujillo', 'Frontend', 'Ingeniero de Software (UI) · Diseñador UX/UI'),
  row('Jhon Escobar', 'QA', 'Ingeniero de Control de Calidad (QA)'),
]});

const children = [
  // PORTADA
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1400, after: 60 }, children: [new TextRun({ text: 'GUION DE EXPOSICIÓN', bold: true, size: 40, color: MORADO })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Proyecto: MUELLE DIGITAL', bold: true, size: 30 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 }, children: [new TextRun({ text: 'Marketplace de experiencias ecoturísticas fluviales', italics: true, size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Equipo: Esteban Merlano · Andres Rangel · Keyner Trujillo · Jhon Escobar', size: 22 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 }, children: [new TextRun({ text: 'Duración total aprox. 20 minutos', size: 22 })] }),

  // LEYENDA
  new Paragraph({ shading: { fill: 'F3F0FB', type: ShadingType.CLEAR }, spacing: { before: 200, after: 60 }, children: [new TextRun({ text: 'CÓMO USAR ESTE GUION', bold: true })] }),
  new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: '🗣  Lo que aparece en GRIS es lo que deben DECIR (su libreto). Pueden leerlo o decirlo con sus palabras.', color: GRIS })] }),
  new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: '👉 En gris cursiva están las INDICACIONES de qué mostrar en pantalla.', color: GRIS2, italics: true })] }),
  P('El texto en negro y morado es la estructura (fases y tiempos). Cada quien presenta su rol en 3–4 minutos siguiendo las 4 fases.'),
  new Paragraph({ children: [new PageBreak()] }),

  // ORDEN Y PREPARACIÓN
  H1('Orden de la exposición y preparación'),
  P('Orden sugerido (cada uno 3–4 min):'),
  ...BL([
    '1) Esteban — Líder (abre con el contexto y la gestión) + Backend + Despliegue.',
    '2) Andres — Base de datos.',
    '3) Keyner — Frontend (hace la demostración en vivo de la app).',
    '4) Jhon — QA (calidad y seguridad).',
    '5) Cierre general del equipo (5 min): demo final + retrospectiva + lecciones aprendidas.',
  ]),
  P('Tener ABIERTO y listo antes de empezar (en pestañas):'),
  ...BL([
    'La app en vivo: https://muelle-digital.vercel.app',
    'La documentación de la API (Swagger): https://muelle-digital-api.vercel.app/api/docs',
    'El tablero de ClickUp y el repositorio en GitHub.',
    'El diagrama Entidad-Relación y el de arquitectura.',
  ]),
  H2('Roles del equipo vs. roles de la guía'),
  P('Como somos 4, cada uno cubre uno o varios roles de la guía:'),
  tablaRoles,
  new Paragraph({ children: [new PageBreak()] }),

  // ===== ESTEBAN =====
  H1('1. Esteban Merlano — Líder, Backend y Despliegue'),
  FASE('① Introducción (30 segundos)'),
  SAY('Buenos días. Soy Esteban Merlano, líder del proyecto y encargado del backend y del despliegue. Les presentamos Muelle Digital, una plataforma web que digitaliza el ecoturismo fluvial en Barrancabermeja: conecta a turistas con guías y pescadores locales para reservar y pagar experiencias en el río de forma segura.'),
  FASE('② Demostración (2 minutos)'),
  NOTA('Muestra el tablero de ClickUp y el repositorio con sus ramas.'),
  SAY('Como líder, planifiqué el proyecto en 8 semanas con metodología ágil. Aquí está nuestro tablero en ClickUp con los entregables por semana, y el repositorio en GitHub con la estrategia GitFlow: una rama por rol más las ramas develop y producción.'),
  NOTA('Abre el Swagger (/api/docs) y luego la app en vivo.'),
  SAY('En lo técnico, desarrollé la API REST con Node.js y Express. Aquí está documentada con Swagger. La seguridad usa contraseñas encriptadas con bcrypt y autenticación con tokens JWT según el rol del usuario. Los pagos se integran con Stripe. Y desplegué todo en Vercel: esta es la aplicación funcionando en producción.'),
  FASE('③ Integración con el equipo (1 minuto)'),
  SAY('Como líder, coordiné los tres frentes: Andres definió la base de datos sobre la que mi backend consulta; Keyner construyó el frontend que consume mi API; y Jhon validó todo con pruebas antes de integrarlo mediante Pull Requests. Mi rol fue unir las piezas y llevar el producto a producción.'),
  FASE('④ Posibles preguntas (30 segundos)'),
  NOTA('Respuestas sugeridas:'),
  SAY('¿Por qué Node y no otro lenguaje? Para usar un solo lenguaje en frontend y backend, acelerar el desarrollo y desplegar gratis en Vercel.'),
  SAY('¿Cómo protegen las claves secretas? En variables de entorno cifradas en Vercel; nunca están en el código ni en GitHub.'),

  // ===== ANDRES =====
  H1('2. Andres Rangel — Base de Datos'),
  FASE('① Introducción (30 segundos)'),
  SAY('Soy Andres Rangel, encargado de la base de datos. Diseñé el modelo de datos, que es la fuente de verdad de toda la plataforma.'),
  FASE('② Demostración (2 minutos)'),
  NOTA('Muestra el diagrama Entidad-Relación y la consola de Neon.'),
  SAY('Modelé seis entidades: usuarios, experiencias, reservas, calificaciones, pagos y solicitudes de guía. Las relaciones son de uno a muchos: un guía publica muchas experiencias y un turista hace muchas reservas. El modelo está normalizado hasta la tercera forma normal, así que no hay datos repetidos.'),
  SAY('Uso PostgreSQL en la nube con Neon. En seguridad, las contraseñas se guardan cifradas con bcrypt, la conexión es por SSL, y puse restricciones que validan los datos —por ejemplo, que la calificación sea de 1 a 5—. También agregué índices para que las búsquedas sean rápidas.'),
  FASE('③ Integración con el equipo (1 minuto)'),
  SAY('Mi base de datos es el cimiento del backend de Esteban: definí las tablas y relaciones que él consulta para experiencias, reservas y pagos, y que Jhon verificó en las pruebas de seguridad. Lo que ve el usuario en el frontend de Keyner sale de aquí.'),
  FASE('④ Posibles preguntas (30 segundos)'),
  NOTA('Respuestas sugeridas:'),
  SAY('¿Por qué PostgreSQL y no MongoDB? Porque los datos son relacionales (usuarios, reservas, pagos) y necesitábamos integridad referencial entre ellos.'),
  SAY('¿Qué es la tercera forma normal? Organizar los datos para evitar redundancia y que cada dato dependa solo de su clave.'),

  // ===== KEYNER =====
  H1('3. Keyner Trujillo — Frontend'),
  FASE('① Introducción (30 segundos)'),
  SAY('Soy Keyner Trujillo, desarrollador frontend. Construí toda la interfaz con la que interactúa el usuario.'),
  FASE('② Demostración (2 minutos) — DEMO EN VIVO'),
  NOTA('Abre la app y navega: catálogo → detalle (mapa y reseñas) → inicia sesión → modo oscuro.'),
  SAY('La aplicación está hecha en React con Vite y TailwindCSS. Aquí está el catálogo de experiencias con filtros. Al abrir una experiencia se ve el detalle con el mapa del punto de encuentro —usando MapLibre con mapas abiertos— y las reseñas, que se actualizan en tiempo real.'),
  SAY('Tenemos modo claro y oscuro con la identidad morada de la marca, tomada del logo. Me conecto al backend con Axios, enviando el token de sesión en cada petición, y toda la interfaz es responsive: se adapta a celular, tablet y computador.'),
  FASE('③ Integración con el equipo (1 minuto)'),
  SAY('Mi frontend consume la API que hizo Esteban y muestra los datos que vienen de la base de datos de Andres. Para integrarnos sin choques nos basamos en el contrato de la API documentado en Swagger, y Jhon probó cada pantalla antes de aprobarla.'),
  FASE('④ Posibles preguntas (30 segundos)'),
  NOTA('Respuestas sugeridas:'),
  SAY('¿Cómo manejan la sesión del usuario? Con el Context de React y el token guardado en el navegador, que se envía en cada petición.'),
  SAY('¿Es responsive? Sí, se adapta a cualquier tamaño de pantalla.'),

  // ===== JHON =====
  H1('4. Jhon Escobar — Aseguramiento de Calidad (QA)'),
  FASE('① Introducción (30 segundos)'),
  SAY('Soy Jhon Escobar, encargado de la calidad. Mi rol fue asegurar que la plataforma sea confiable y segura, sobre todo porque maneja datos personales y pagos.'),
  FASE('② Demostración (2 minutos)'),
  NOTA('Muestra la tabla de casos de prueba y ejecuta 1–2 en vivo (login inválido, o intentar pagar una reserva ajena → error 403).'),
  SAY('Diseñé un plan con 22 casos de prueba: 15 funcionales y 7 de seguridad. Probé el flujo completo de registro, reserva y pago. En seguridad verifiqué que sin token no se puede entrar, que un turista no puede crear experiencias, y que nadie puede pagar una reserva ajena.'),
  SAY('Encontré 3 errores; el más importante: al inicio cualquiera podía registrarse como guía. Lo reporté, el equipo lo corrigió y ahora el rol de guía solo lo aprueba el administrador. Además usamos revisión de código por Pull Requests antes de integrar.'),
  FASE('③ Integración con el equipo (1 minuto)'),
  SAY('La calidad es transversal: probé el backend de Esteban, el frontend de Keyner y la integridad de los datos de Andres. Antes de fusionar cualquier cambio revisaba el Pull Request. Mi rol fue el que dio la confianza para desplegar a producción.'),
  FASE('④ Posibles preguntas (30 segundos)'),
  NOTA('Respuestas sugeridas:'),
  SAY('¿Las pruebas son automatizadas? En esta versión fueron manuales y por endpoints; automatizarlas con CI/CD queda como mejora futura.'),
  SAY('¿Cómo prueban la seguridad? Intentando accesos indebidos y verificando que el sistema los rechace correctamente.'),
  new Paragraph({ children: [new PageBreak()] }),

  // ===== CIERRE GENERAL =====
  H1('5. Cierre general del equipo (5 minutos)'),
  H2('Demostración del producto final'),
  NOTA('Hagan un recorrido completo y real frente al jurado:'),
  SAY('Para cerrar, mostramos el sistema completo: como turista buscamos una experiencia, la reservamos y la pagamos con tarjeta de prueba; como guía publicamos una experiencia y marcamos el punto de encuentro en el mapa; y como administrador aprobamos una solicitud de guía y vemos las métricas de la plataforma.'),
  H2('Retrospectiva del equipo'),
  SAY('Lo que funcionó bien: usar un solo lenguaje en todo el proyecto, planear con la metodología SDD antes de programar, y comunicarnos con dailies y un tablero de tareas. Lo que mejoraríamos: automatizar las pruebas y empezar el despliegue aún más temprano.'),
  H2('Lecciones aprendidas'),
  ...BL([
    'Definir y aprobar las especificaciones antes de programar evita retrabajo.',
    'La trazabilidad entre requisitos, base de datos, API e interfaz mantiene al equipo alineado.',
    'Git con Pull Requests mejora la calidad y el trabajo en equipo.',
    'Desplegar temprano reduce sorpresas al final.',
  ]),
  SAY('Con esto demostramos que Muelle Digital resuelve un problema real de Barrancabermeja con un producto funcional, seguro y publicado en internet. Muchas gracias, quedamos atentos a sus preguntas.'),

  // ===== CRITERIOS Y TIPS =====
  H1('Recuerden: así los evalúan (y consejos)'),
  P('La guía evalúa cuatro aspectos; apunten a todos:'),
  ...BL([
    'Comprensión del rol (25%): usen el vocabulario técnico de su área con seguridad.',
    'Calidad de los entregables (30%): muestren evidencia real (la app, Swagger, el diagrama, la tabla de pruebas).',
    'Integración con el equipo (20%): cada uno explique cómo se conecta con los demás (la fase ③).',
    'Presentación y comunicación (25%): hablen claro, sin leer de corrido, y respondan con calma.',
  ]),
  H2('Consejos para una gran exposición'),
  ...BL([
    'Practiquen una vez con cronómetro: 3–4 min cada uno, 20 en total.',
    'Tengan todo abierto antes de empezar (app, Swagger, ClickUp, diagramas).',
    'Si falla el internet, tengan capturas de pantalla de respaldo.',
    'Miren al jurado, no a la pantalla. Hablen con seguridad: ustedes lo construyeron.',
    'Cierren fuerte: "es un producto real, funcional y desplegado".',
  ]),
];

const doc = new Document({
  creator: 'Equipo Muelle Digital',
  title: 'Guion de exposición — Muelle Digital',
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 30, bold: true, font: 'Arial', color: MORADO }, paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: 'Arial', color: '333333' }, paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 1 } },
    ],
  },
  numbering: { config: [{ reference: 'b', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Guion de exposición — Muelle Digital · Página ', size: 18, color: '888888' }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888' })] })] }) },
    children,
  }],
});

const out = process.argv[2] || 'Guion_Exposicion_Muelle_Digital.docx';
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log('✅ Generado:', out); });
