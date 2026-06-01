// Genera el "Formato Estándar de Proyectos SDD" DILIGENCIADO para Muelle Digital.
import fs from 'node:fs';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  LevelFormat, Header, Footer, PageNumber, PageBreak,
} from 'docx';

const MORADO = '512888';
const P = (text, opts = {}) => new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, ...opts })] });
const H1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 280, after: 140 }, children: [new TextRun(text)] });
const H2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, children: [new TextRun(text)] });
const BL = (items) => items.map((t) => new Paragraph({ numbering: { reference: 'b', level: 0 }, spacing: { after: 60 }, children: [new TextRun(t)] }));
const campo = (label, val) => new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: label + ': ', bold: true }), new TextRun(val)] });

// --- Tabla de Requisitos Funcionales ---
const rfBorder = { style: BorderStyle.SINGLE, size: 1, color: 'BBBBBB' };
const rfBorders = { top: rfBorder, bottom: rfBorder, left: rfBorder, right: rfBorder };
const cell = (text, w, head = false) => new TableCell({
  borders: rfBorders, width: { size: w, type: WidthType.DXA },
  shading: head ? { fill: 'EDE9FD', type: ShadingType.CLEAR } : undefined,
  margins: { top: 60, bottom: 60, left: 100, right: 100 },
  children: [new Paragraph({ children: [new TextRun({ text, bold: head })] })],
});
const rfRow = (a, b, c, d, head = false) => new TableRow({ children: [cell(a, 1100, head), cell(b, 5260, head), cell(c, 1500, head), cell(d, 1500, head)] });
const tablaRF = new Table({
  width: { size: 9360, type: WidthType.DXA }, columnWidths: [1100, 5260, 1500, 1500],
  rows: [
    rfRow('ID', 'Requisito', 'Prioridad', 'Estado', true),
    rfRow('RF01', 'Registro de usuarios', 'Alta', 'Implementado'),
    rfRow('RF02', 'Inicio de sesión (JWT)', 'Alta', 'Implementado'),
    rfRow('RF03', 'Búsqueda y filtros de experiencias', 'Media', 'Implementado'),
    rfRow('RF04', 'Reserva con control de cupos', 'Alta', 'Implementado'),
    rfRow('RF05', 'Pago en línea (Stripe)', 'Alta', 'Implementado'),
    rfRow('RF06', 'Reseñas y calificaciones', 'Media', 'Implementado'),
    rfRow('RF07', 'Verificación de guías (admin)', 'Alta', 'Implementado'),
    rfRow('RF08', 'Panel de administración', 'Media', 'Implementado'),
  ],
});

const children = [
  // ---------- PORTADA ----------
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200, after: 60 }, children: [new TextRun({ text: 'FORMATO ESTÁNDAR DE PROYECTOS DE DESARROLLO DE SOFTWARE', bold: true, size: 30 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: 'Metodología Spec-Driven Development (SDD)', italics: true, size: 26 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: 'MUELLE DIGITAL', bold: true, size: 44, color: MORADO })] }),
  campo('Nombre del proyecto', 'Muelle Digital'),
  campo('Tipo de proyecto', 'Aplicación web — Marketplace de experiencias ecoturísticas fluviales'),
  campo('Institución / Empresa', '__________________________ (completar)'),
  campo('Integrantes', 'Esteban Merlano (Líder, Backend y Despliegue) · Keyner Trujillo (Frontend) · Andres Rangel (Base de Datos) · Jhon Escobar (QA)'),
  campo('Director / Tutor', '__________________________ (completar)'),
  campo('Fecha', 'Junio de 2026'),
  campo('Versión del documento', '1.0'),
  new Paragraph({ children: [new PageBreak()] }),

  // ---------- 1. INTRODUCCIÓN ----------
  H1('1. Introducción'),
  H2('Contexto del problema'),
  P('El ecoturismo fluvial en Barrancabermeja (avistamiento de manatíes, pesca artesanal, paseos en canoa y aviturismo) se ofrece de manera informal, sin canales digitales que conecten a los turistas con los guías y pescadores locales.'),
  H2('Planteamiento del problema'),
  P('No existe una plataforma centralizada para descubrir, reservar y pagar estas experiencias; los turistas no saben a quién contactar, no hay precios claros ni mecanismos de confianza, y los pagos son informales.'),
  H2('Justificación'),
  P('Una plataforma digital formaliza la actividad, da visibilidad y reputación a los guías locales, brinda seguridad y facilidad de reserva a los turistas, e impulsa la economía de la región.'),
  H2('Objetivos generales y específicos'),
  P('Objetivo general: desarrollar una plataforma web tipo marketplace para reservar y pagar experiencias ecoturísticas fluviales.'),
  ...BL([
    'Permitir reservas digitales con control de cupos.',
    'Integrar pagos en línea (Stripe) y métodos locales simulados.',
    'Crear un sistema de reputación (reseñas en tiempo real).',
    'Geolocalizar el punto de encuentro en un mapa.',
    'Formalizar a los guías mediante verificación del administrador.',
  ]),
  H2('Alcance del proyecto'),
  P('MVP fullstack desplegado en producción: catálogo con filtros, reservas, pagos (Stripe en modo prueba), reseñas, mapas, verificación de guías y panel de administración. Quedan fuera del alcance la app móvil nativa y el cobro real en producción.'),

  // ---------- 2. MARCO TEÓRICO ----------
  H1('2. Marco Teórico'),
  H2('Ingeniería de software'),
  P('Disciplina que aplica procesos sistemáticos —análisis, diseño, implementación, pruebas y despliegue— para construir software de calidad, mantenible y confiable.'),
  H2('Desarrollo guiado por especificaciones (SDD)'),
  P('Enfoque en el que las especificaciones (requisitos, historias de usuario y contratos de API) se definen y aprueban antes de programar, y el código se valida contra ellas, asegurando trazabilidad.'),
  H2('Tecnologías relacionadas'),
  P('Aplicaciones web de página única (SPA), APIs REST, bases de datos relacionales, autenticación basada en tokens (JWT), pasarelas de pago y mapas basados en datos abiertos (OpenStreetMap).'),
  H2('Arquitecturas de software'),
  P('Modelo cliente-servidor desacoplado; arquitectura por capas en el backend (rutas, controladores, acceso a datos); despliegue serverless en la nube.'),

  // ---------- 3. METODOLOGÍA SDD ----------
  H1('3. Metodología Spec-Driven Development (SDD)'),
  H2('Descripción de la metodología'),
  P('Se definieron primero las especificaciones (historias de usuario, modelo de datos y contrato de la API) y a partir de ellas se implementó y validó el sistema.'),
  H2('Principios fundamentales'),
  ...BL([
    'La especificación precede y guía al código.',
    'Trazabilidad entre cada requisito y su módulo.',
    'Control de versiones de documentación y código.',
    'Validación continua contra las especificaciones.',
  ]),
  H2('Fases del proceso'),
  P('Definición → Arquitectura/Especificación → Desarrollo por sprints → Pruebas (QA) → Despliegue y entrega.'),
  H2('Control de cambios y trazabilidad'),
  P('Git con flujo GitFlow (ramas por rol), gestión de tareas en ClickUp y un documento maestro versionado. Cada historia de usuario está mapeada a sus endpoints y pantallas.'),

  // ---------- 4. ANÁLISIS DE REQUISITOS ----------
  H1('4. Análisis de Requisitos'),
  H2('Requisitos funcionales'),
  P('Resumen de los principales requisitos funcionales (ver tabla):'),
  tablaRF,
  H2('Requisitos no funcionales'),
  ...BL([
    'Seguridad: contraseñas con bcrypt, JWT, conexión SSL y control de acceso por rol.',
    'Usabilidad: interfaz responsive con modo claro/oscuro.',
    'Rendimiento: índices en la base de datos y despliegue serverless.',
    'Disponibilidad: alojamiento en la nube (Vercel + Neon).',
    'Mantenibilidad: código modular y documentado.',
  ]),
  H2('Historias de usuario'),
  P('Se redactaron 13 historias de usuario para los actores turista, guía y administrador. Ejemplo: "Como turista quiero reservar un recorrido para asegurar mi cupo".'),
  H2('Casos de uso'),
  P('Principales: Registrarse/Iniciar sesión, Buscar y reservar experiencia, Pagar reserva, Publicar experiencia (guía), Aprobar guía (admin) y Calificar experiencia.'),
  H2('Criterios de aceptación'),
  P('Ejemplos: contraseña de mínimo 6 caracteres; la reserva valida cupos disponibles; la reseña usa puntuación de 1 a 5 con una sola reseña por usuario y experiencia; el guía solo publica tras ser aprobado.'),

  // ---------- 5. ESPECIFICACIÓN DEL SISTEMA ----------
  H1('5. Especificación del Sistema'),
  H2('Arquitectura general'),
  P('Frontend en React que consume una API REST en Node/Express, la cual persiste los datos en PostgreSQL (NeonDB). La autenticación viaja como token JWT en la cabecera de cada petición.'),
  H2('Diagramas UML'),
  P('Diagrama de casos de uso (actores: turista, guía, administrador) y diagrama de secuencia del flujo de reserva y pago. (Ver Anexos.)'),
  H2('Modelo entidad-relación'),
  P('Seis entidades: usuarios, experiencias, reservas, ratings, pagos y solicitudes_guia, con relaciones 1:N e integridad referencial; modelo normalizado a 3FN. (Diagrama en Anexos.)'),
  H2('Especificación de APIs'),
  P('La API está documentada con OpenAPI 3 y Swagger UI, disponible en /api/docs. Agrupa endpoints de autenticación, experiencias, reservas, ratings, pagos, solicitudes y administración.'),
  H2('Prototipos de interfaz'),
  P('Pantallas implementadas: landing, login/registro, catálogo (lista-detalle), detalle con mapa y reseñas, paneles de guía y administrador, e historial de reservas.'),

  // ---------- 6. DISEÑO TÉCNICO ----------
  H1('6. Diseño Técnico'),
  H2('Tecnologías utilizadas'),
  ...BL([
    'Frontend: React 18, Vite, TailwindCSS, React Router, Axios, MapLibre GL.',
    'Backend: Node.js, Express, JWT, bcrypt, Stripe, driver pg.',
    'Base de datos: PostgreSQL en NeonDB.',
    'Despliegue: Vercel (frontend + backend serverless). Documentación: Swagger.',
  ]),
  H2('Estructura del proyecto'),
  P('backend/ (config, middleware, controllers, routes, database) y frontend/ (api, context, components, pages). Cada capa con una responsabilidad única.'),
  H2('Patrones de diseño'),
  P('Arquitectura por capas (rutas/controladores), middleware de autenticación, Context API para el estado global, componentes reutilizables y acceso a datos centralizado con SQL parametrizado.'),
  H2('Seguridad y rendimiento'),
  P('Contraseñas con bcrypt, JWT por rol, claves en variables de entorno (no en el código), consultas parametrizadas y SSL. Rendimiento con índices en la BD y despliegue serverless escalable.'),

  // ---------- 7. PLAN DE DESARROLLO ----------
  H1('7. Plan de Desarrollo'),
  H2('Cronograma'),
  P('Ocho semanas: (1) definición, (2) arquitectura, (3-6) cuatro sprints de desarrollo, (7) QA y (8) documentación y despliegue.'),
  H2('Distribución de roles'),
  ...BL([
    'Esteban Merlano — Líder del proyecto, Backend y Despliegue.',
    'Keyner Trujillo — Frontend.',
    'Andres Rangel — Base de datos.',
    'Jhon Escobar — Aseguramiento de calidad (QA).',
  ]),
  H2('Gestión de versiones'),
  P('Git y GitHub con GitFlow: ramas produccion, develop y una por rol (backend, frontend, base-de-datos, qa). Integración mediante Pull Requests con revisión de código.'),
  H2('Metodología de trabajo'),
  P('Ágil con sprints semanales, reuniones diarias breves (daily), tablero de tareas en ClickUp y retrospectivas al cierre de cada sprint.'),

  // ---------- 8. IMPLEMENTACIÓN ----------
  H1('8. Implementación'),
  H2('Descripción de módulos'),
  P('Autenticación, Experiencias, Reservas, Reseñas, Pagos (Stripe), Solicitudes de guía y Administración.'),
  H2('Integración del sistema'),
  P('El frontend consume la API REST con Axios; el backend se integra con NeonDB (datos), Stripe (pagos) y OpenFreeMap (mapas). La confirmación de pagos es idempotente (webhook y verificación de sesión).'),
  H2('Evidencias de desarrollo'),
  P('Repositorio Git con historial por ramas, aplicación desplegada (URLs en la sección 10) y documentación de API en vivo (Swagger).'),

  // ---------- 9. PLAN DE PRUEBAS ----------
  H1('9. Plan de Pruebas'),
  H2('Pruebas unitarias'),
  P('Validación de reglas de negocio: control de cupos, rango de puntuación (1-5), restricciones por rol y formato de datos.'),
  H2('Pruebas de integración'),
  P('Pruebas de extremo a extremo de los endpoints (registro → reserva → pago) ejecutadas contra la base de datos real en Neon.'),
  H2('Pruebas funcionales'),
  P('22 casos de prueba en total (15 funcionales y 7 de seguridad): login, filtros, reservas con y sin cupos, pagos, reseñas y verificación de guías.'),
  H2('Resultados y validación'),
  P('100 % de casos exitosos tras correcciones; 3 defectos detectados y cerrados; flujo de pago con Stripe verificado en modo prueba (tarjeta 4242 4242 4242 4242).'),

  // ---------- 10. DESPLIEGUE ----------
  H1('10. Despliegue'),
  H2('Infraestructura'),
  P('Vercel (frontend + backend como funciones serverless) y NeonDB (PostgreSQL). Aplicación en vivo:'),
  ...BL([
    'Aplicación: https://muelle-digital.vercel.app',
    'API: https://muelle-digital-api.vercel.app',
    'Documentación API (Swagger): https://muelle-digital-api.vercel.app/api/docs',
  ]),
  H2('Configuración del servidor'),
  P('Variables de entorno cifradas en Vercel (DATABASE_URL, JWT_SECRET, claves de Stripe, CLIENT_URL); el backend corre como función serverless (api/index.js + vercel.json) y el CORS se restringe al dominio del frontend.'),
  H2('Manual de instalación'),
  P('1) Clonar el repositorio. 2) En backend/ y frontend/: npm install. 3) Configurar el archivo .env. 4) Crear la base de datos con npm run db:setup. 5) Ejecutar con npm run dev.'),
  H2('Manual de usuario'),
  P('Turista: busca, reserva, paga y califica. Guía: publica experiencias y marca el punto de encuentro en el mapa (previa aprobación). Administrador: aprueba guías y gestiona usuarios, experiencias y pagos.'),

  // ---------- 11. RESULTADOS Y EVALUACIÓN ----------
  H1('11. Resultados y Evaluación'),
  H2('Resultados obtenidos'),
  P('Plataforma fullstack funcional y desplegada en producción, con las 13 historias de usuario implementadas, pagos reales en modo prueba y mapas operativos.'),
  H2('Comparación con objetivos'),
  P('Se cumplieron todos los objetivos específicos: reservas, pagos, reseñas, geolocalización y verificación de guías.'),
  H2('Limitaciones encontradas'),
  P('Pagos en modo de prueba (no cobro real), sin aplicación móvil nativa y reparto de comisiones por guía (Stripe Connect) planteado como trabajo futuro.'),

  // ---------- 12. CONCLUSIONES Y RECOMENDACIONES ----------
  H1('12. Conclusiones y Recomendaciones'),
  H2('Conclusiones'),
  P('La metodología SDD permitió construir un MVP coherente, seguro y desplegado; el uso de un stack homogéneo (JavaScript en frontend y backend) aceleró el desarrollo y facilitó la integración.'),
  H2('Recomendaciones futuras'),
  P('Implementar Stripe Connect para comisiones por guía, automatizar pruebas con CI/CD, agregar geolocalización avanzada y desarrollar una aplicación móvil.'),

  // ---------- 13. REFERENCIAS ----------
  H1('13. Referencias Bibliográficas'),
  P('Documentación oficial consultada (formato APA/IEEE):'),
  ...BL([
    'React. (s. f.). React Documentation. https://react.dev',
    'OpenJS Foundation. (s. f.). Node.js & Express Documentation.',
    'The PostgreSQL Global Development Group. (s. f.). PostgreSQL Documentation.',
    'Stripe. (s. f.). Stripe API Reference. https://docs.stripe.com',
    'MapLibre / OpenStreetMap. (s. f.). MapLibre GL JS & OSM.',
    'Vercel & Neon. (s. f.). Documentación de despliegue.',
  ]),

  // ---------- 14. ANEXOS ----------
  H1('14. Anexos'),
  H2('Código fuente'),
  P('Repositorio Git con ramas por rol (produccion, develop, backend, frontend, base-de-datos, qa).'),
  H2('Diagramas'),
  P('Diagrama Entidad-Relación, diagrama de arquitectura y cronograma (incluidos en el documento maestro del proyecto).'),
  H2('Encuestas'),
  P('No aplica para esta entrega.'),
  H2('Manuales'),
  P('Manual de usuario y manual de instalación (incluidos en este documento y en los entregables del equipo).'),
  H2('Documentación adicional'),
  P('Documentación interactiva de la API (Swagger), documento maestro y entregables por rol.'),
];

const doc = new Document({
  creator: 'Equipo Muelle Digital',
  title: 'Formato SDD — Muelle Digital',
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 30, bold: true, font: 'Arial', color: MORADO },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial', color: '333333' },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [{ reference: 'b', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Muelle Digital — Formato SDD · Página ', size: 18, color: '888888' }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888' })] })] }) },
    children,
  }],
});

const out = process.argv[2] || 'Formato_Proyecto_SDD_Muelle_Digital.docx';
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log('✅ Generado:', out); });
