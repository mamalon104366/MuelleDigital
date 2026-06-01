# 🛶 MUELLE DIGITAL — DOCUMENTO MAESTRO DEL PROYECTO

> Marketplace de experiencias ecoturísticas fluviales en Barrancabermeja y zonas cercanas.
> Este documento es la **fuente de verdad** del proyecto. Aquí está todo: visión, alcance, arquitectura, modelo de datos, API y estado de avance.

---

## 0. Estado actual del proyecto (avance real)

| Módulo | Estado | Notas |
|--------|--------|-------|
| Documentación maestra | ✅ Hecho | Este archivo |
| Estructura de carpetas | ✅ Hecho | `backend/` + `frontend/` |
| Backend Node + Express | ✅ Hecho | API REST completa (auth, experiencias, reservas, ratings, pagos) |
| Esquema SQL (PostgreSQL/Neon) | ✅ Hecho | `backend/database/schema.sql` |
| Datos de ejemplo (seed) | ✅ Hecho | `backend/database/seed.sql` |
| Frontend React + Vite + Tailwind | ✅ Hecho | Todas las pantallas del MVP |
| Conexión real a NeonDB | ✅ Hecho | `.env` configurado; `schema.sql` + `seed.sql` ejecutados; probado (login + listado) |
| Mapas (MapLibre + OpenFreeMap) | ✅ Hecho | Punto de encuentro: selector para guía + mapa en oferta/detalle + mapa global admin |
| Solicitudes de guía + verificación | ✅ Hecho | Formulario → tabla `solicitudes_guia` → admin aprueba (probado E2E) |
| Panel admin (control total) | ✅ Hecho | Solicitudes, usuarios, experiencias, reservas, pagos, métricas + mapa |
| Reseñas en tiempo real | ✅ Hecho | Polling ~6s en el detalle |
| Branding (logo + tema) | ✅ Hecho | Paleta índigo del logo; `Logo.jsx` con contorno blanco |
| Pagos con Stripe (modo test) | ✅ Hecho | Product/Price auto + Checkout Session + webhook/verify (probado E2E). Ver §21 |
| Listo para Vercel | ✅ Hecho | `backend/api/index.js` + `vercel.json` (back y front) |
| Despliegue en Vercel | ⏳ Pendiente | Falta hacer el deploy real (front + back) en la cuenta del usuario |

> **Siguiente paso:** desplegar en Vercel (frontend + backend) siguiendo la sección 18. DB conectada en Neon; Stripe configurado en modo test.

---

## 1. Información General

- **Nombre:** Muelle Digital
- **Tipo:** Marketplace de experiencias ecoturísticas fluviales.
- **Objetivo principal:** Centralizar la oferta de experiencias fluviales en Barrancabermeja mediante un sistema digital de reservas para pescadores, guías y cooperativas, permitiendo a turistas encontrar experiencias seguras, organizadas y verificadas.

### Problema a resolver
- No existe un sistema centralizado para reservar experiencias.
- Los turistas no saben a quién contactar.
- No hay precios claros.
- No existen mecanismos de confianza.
- Pescadores y guías trabajan de forma informal.
- No hay pagos digitales integrados.

### Solución
Plataforma web que funcione como marketplace de experiencias fluviales:
- Reservar recorridos turísticos.
- Ver calificaciones de guías.
- Realizar pagos digitales (Nequi / Daviplata).
- Revisar temporadas turísticas.
- Organizar experiencias por categorías.

---

## 2. Objetivos

### General
Diseñar y desarrollar una plataforma web que formalice y organice el ecoturismo fluvial mediante un sistema de reservas centralizado.

### Específicos
1. Permitir reservas digitales de experiencias fluviales.
2. Integrar pagos mediante Nequi y Daviplata (simulados en el MVP).
3. Crear un sistema de reputación (ratings y comentarios).
4. Mostrar temporadas recomendadas.
5. Facilitar la formalización económica de pescadores y guías.

---

## 3. Público Objetivo

- **Turistas:** ecoturismo, avistamiento de fauna, paseos fluviales. Necesitan seguridad, confianza, precios claros, facilidad de reserva.
- **Guías locales / pescadores:** conseguir clientes, formalizar ingresos, visibilidad y reputación online.
- **Cooperativas fluviales (Coomfluviales):** organizar reservas, controlar agenda, gestionar disponibilidad.

---

## 4. Roles del Sistema

| Rol | Permisos |
|-----|----------|
| **Turista** | Registrarse, iniciar sesión, explorar, reservar, pagar, calificar, comentar |
| **Guía local** | Crear experiencias, definir precios, administrar cupos, aceptar reservas, ver calendario |
| **Administrador** | Moderar contenido, gestionar usuarios, validar guías, eliminar reportes, ver métricas |

---

## 5. Historias de Usuario

- **HU-01 Registro** — Como turista quiero crear una cuenta para reservar experiencias. *(email, contraseña segura, validación)*
- **HU-02 Buscar Experiencias** — filtros por precio, temporada, tipo/categoría, ubicación.
- **HU-03 Reserva** — calendario visible, selección de fecha, confirmación.
- **HU-04 Sistema de Rating** — puntuación 1–5, comentario opcional, historial.
- **HU-05 Gestión de Experiencias** (guía) — descripción, precio, cupos, imágenes.
- **HU-06 Pagos** — Nequi/Daviplata, comprobante, validación de estado, confirmación.

---

## 6. Arquitectura del Sistema

Modelo **cliente-servidor** desacoplado.

```
┌─────────────────┐      HTTPS / JSON      ┌──────────────────┐      SQL       ┌─────────────────┐
│  FRONTEND        │  ───────────────────▶  │  BACKEND API     │  ───────────▶  │  PostgreSQL     │
│  React + Vite    │  ◀───────────────────  │  Node + Express  │  ◀───────────  │  (NeonDB)       │
│  Tailwind + Axios│      JWT en header     │  JWT + bcrypt    │                │                 │
└─────────────────┘                        └──────────────────┘                └─────────────────┘
   Vercel/Netlify                              Render (free)                       Neon (free)
```

- **Frontend:** interfaz, formularios, navegación, visualización de experiencias.
- **Backend:** autenticación, lógica de negocio, reservas, pagos, API REST.
- **Base de datos:** usuarios, experiencias, reservas, pagos, ratings.

---

## 7. Modelo de Datos (Entidades)

> Implementado en `backend/database/schema.sql`. Resumen:

- **usuarios** — `id, nombre, email, password_hash, rol, telefono, created_at`
- **experiencias** — `id, titulo, descripcion, precio, ubicacion, temporada, guia_id → usuarios, cupos, imagen, categoria, created_at`
- **reservas** — `id, usuario_id → usuarios, experiencia_id → experiencias, fecha, personas, estado, created_at`
- **ratings** — `id, usuario_id → usuarios, experiencia_id → experiencias, puntuacion (1-5), comentario, created_at` *(UNIQUE usuario+experiencia)*
- **pagos** — `id, reserva_id → reservas, metodo_pago, estado, valor, referencia, fecha`

> Campos añadidos a la propuesta original (justificados por las HU): `experiencias.categoria` (HU-02 filtro por tipo), `reservas.personas` (control de cupos), `pagos.referencia` (comprobante).

---

## 8. Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18, Vite, TailwindCSS, Axios, React Router |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL (NeonDB) — driver `pg` |
| Autenticación | JWT (`jsonwebtoken`) + `bcryptjs` |
| Hosting backend | Vercel (Serverless Functions, free) |
| Hosting frontend | Vercel (free) |
| Gestión | GitHub + ClickUp |

**¿Por qué Node + Express?** Mismo lenguaje que el frontend (JavaScript), ecosistema enorme, ligero y sin sobreingeniería. Se despliega gratis en **Vercel** como función serverless (`backend/api/index.js`), junto al frontend. Cumple "gratis + APIs + montable en sistema gratuito + consumible por el front". Neon (Postgres) se integra de forma nativa con Vercel serverless usando el endpoint `-pooler`.

---

## 9. Diseño UI/UX

Pantallas: Landing, Login/Register, Home de experiencias, Detalle de experiencia, Reservar, Perfil del guía / Dashboard guía, Dashboard admin, Historial de reservas.

Reglas: navegación intuitiva, responsive, accesibilidad básica, botones visibles, flujo de reserva simple.

---

## 10. Organización del Equipo

- **Backend Lead:** API, autenticación, base de datos, endpoints.
- **Frontend Lead:** pantallas, responsive, consumo API.
- **QA Lead:** pruebas, bugs, validación funcional.
- **Project Manager:** cronograma, ClickUp, reuniones, entregables.

---

## 11. Metodología — GitFlow

Ramas: `main` (producción) → `develop` (integración) → `feature/*`, `fix/*`.

Reglas: nunca subir directo a `main`, usar Pull Requests, revisión obligatoria.

---

## 12. Cronograma (8 semanas)

1. **S1 Definición:** HU, roles, GitHub, ClickUp.
2. **S2 Arquitectura:** ER diagram, Figma, stack.
3. **S3 Sprint 1:** login, registro, conexión DB.
4. **S4 Sprint 2:** experiencias, reservas.
5. **S5 Sprint 3:** ratings, pagos.
6. **S6 Sprint 4:** dashboard admin, mejoras UI.
7. **S7 QA:** pruebas funcionales, seguridad, code review.
8. **S8 Entrega:** README, Swagger, demo, sustentación.

---

## 13. QA — Aseguramiento de Calidad

- **Funcional:** login, registro, reserva, pagos, ratings.
- **Seguridad:** JWT, passwords encriptados (bcrypt), acceso restringido por rol.
- **Code Review:** PRs obligatorios, revisión entre compañeros.

---

## 14. API REST

Base URL local: `http://localhost:4000/api`

### Auth
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/auth/register` | público | Registro de usuario |
| POST | `/auth/login` | público | Login, devuelve JWT |
| GET | `/auth/me` | auth | Datos del usuario autenticado |

### Experiencias
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/experiencias` | público | Lista + filtros (`q, ubicacion, temporada, categoria, precio_min, precio_max`) |
| GET | `/experiencias/:id` | público | Detalle + rating promedio |
| POST | `/experiencias` | guía/admin | Crear experiencia |
| PUT | `/experiencias/:id` | guía dueño/admin | Editar |
| DELETE | `/experiencias/:id` | guía dueño/admin | Eliminar |

### Reservas
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/reservas` | turista | Crear reserva (valida cupos) |
| GET | `/reservas` | auth | Turista: las suyas · Guía: de sus experiencias · Admin: todas |
| PATCH | `/reservas/:id/estado` | guía/admin | Confirmar / cancelar |

### Ratings
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/ratings?experiencia_id=` | público | Reseñas de una experiencia |
| POST | `/ratings` | turista | Calificar (1 por experiencia) |

### Pagos
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/pagos` | turista | Pagar reserva (Nequi/Daviplata, simulado) |
| GET | `/pagos` | auth | Pagos del usuario |

> **Header de autenticación:** `Authorization: Bearer <token>`

---

## 15. MVP

Login · Registro · Catálogo de experiencias · Reserva · Rating · Pagos simples · Panel básico. **→ Todo implementado en el código.**

---

## 16. Visión Futura

Geolocalización, chatbot turístico, IA de recomendaciones, mapas interactivos, app móvil, pasarela de pago real.

---

## 17. Cómo correr el proyecto (local)

> Node ya está instalado en `C:\Program Files\nodejs` (v24). Si `node` no responde en la terminal, agrega esa ruta al PATH.

### Backend
```bash
cd backend
npm install
# copia .env.example a .env y pon tu DATABASE_URL de Neon + JWT_SECRET
npm run dev          # arranca en http://localhost:4000
```

### Base de datos (Neon) — YA CONECTADA
El `.env` ya tiene el `DATABASE_URL` y las tablas ya están creadas y pobladas. Para reaplicar el SQL desde el código:
```bash
cd backend
npm run db:setup     # ejecuta schema.sql + seed.sql contra Neon y muestra conteos
# npm run db:schema  # solo tablas
# npm run db:seed    # solo datos de ejemplo
```
También puedes pegar `backend/database/schema.sql` y `seed.sql` en el SQL Editor de Neon.

### Frontend
```bash
cd frontend
npm install
# copia .env.example a .env (VITE_API_URL=http://localhost:4000/api)
npm run dev          # arranca en http://localhost:5173
```

---

## 18. Despliegue en Vercel (frontend + backend)

> Todo se hospeda en **Vercel**. La base de datos ya vive en **Neon** (gratis). Se crean **dos proyectos** de Vercel desde el mismo repo: uno para `backend/` y otro para `frontend/`.

### A) Backend (API) → proyecto Vercel con root `backend/`
- Ya está listo: `backend/api/index.js` (función serverless) + `backend/vercel.json` (redirige todo a la función Express).
- En Vercel → New Project → selecciona el repo → **Root Directory: `backend`**.
- **Environment Variables:**
  - `DATABASE_URL` = (la cadena de Neon, usa el host `-pooler`, ideal para serverless)
  - `JWT_SECRET` = (el secreto generado)
  - `CLIENT_URL` = `https://<tu-frontend>.vercel.app`
- Deploy. La API queda en `https://<tu-backend>.vercel.app` (health: `/api/health`).

### B) Frontend → proyecto Vercel con root `frontend/`
- Vercel detecta Vite automáticamente. `frontend/vercel.json` ya maneja el fallback SPA de React Router.
- En Vercel → New Project → mismo repo → **Root Directory: `frontend`**.
- **Environment Variable:** `VITE_API_URL` = `https://<tu-backend>.vercel.app/api`
- Deploy. La app queda en `https://<tu-frontend>.vercel.app`.

> **Orden recomendado:** despliega primero el backend, copia su URL, ponla en `VITE_API_URL` del frontend y en `CLIENT_URL` del backend (CORS).
>
> 💡 **Alternativa:** la CLI `npx vercel` (desde cada carpeta) hace el deploy sin la web. `npx vercel` para preview, `npx vercel --prod` para producción.

---

## 19. Estructura de carpetas

```
lunes/
├── MUELLE_DIGITAL_MASTER.md      ← este documento
├── README.md
├── backend/
│   ├── package.json
│   ├── .env.example  /  .env     ← .env ya configurado (gitignored)
│   ├── vercel.json               ← config Vercel (serverless)
│   ├── api/index.js              ← entrada serverless para Vercel
│   ├── database/
│   │   ├── schema.sql            ← SQL de las tablas (para Neon)
│   │   ├── seed.sql              ← datos de ejemplo
│   │   └── migrate.js            ← runner: ejecuta el SQL contra Neon
│   └── src/
│       ├── app.js                ← app Express (configuración + rutas)
│       ├── index.js              ← arranque local (listen)
│       ├── config/db.js          ← pool de PostgreSQL
│       ├── middleware/auth.js    ← verificación JWT + roles
│       ├── controllers/          ← lógica de cada recurso
│       ├── routes/               ← definición de endpoints
│       └── utils/                ← helpers (jwt, async handler)
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── vercel.json               ← fallback SPA para React Router
    └── src/
        ├── main.jsx · App.jsx · index.css
        ├── api/client.js         ← instancia Axios con token
        ├── context/AuthContext.jsx
        ├── components/           ← Navbar, ExperienceCard, etc.
        └── pages/                ← Landing, Login, Home, Detalle, Reservas...
```

---

## 20. Base de datos — ✅ CONECTADA Y PROBADA

- `backend/.env` ya tiene el `DATABASE_URL` de Neon y un `JWT_SECRET` aleatorio (archivo gitignored, no se sube a GitHub).
- Se ejecutaron `schema.sql` + `seed.sql` con `npm run db:setup`. Conteos verificados: usuarios=3, experiencias=4, reservas=1, ratings=1, pagos=0.
- Prueba end-to-end OK contra Neon: `GET /api/experiencias` (4 con JOIN de guía + rating) y `POST /api/auth/login` (bcrypt + JWT).

### Recomendación de seguridad
La cadena de conexión se compartió por chat. Cuando quieras, **rota la contraseña** del rol en el panel de Neon (Roles → Reset password) y actualiza `DATABASE_URL` en `backend/.env` y en las variables de entorno de Vercel.

### Lo único que falta
Hacer el **deploy en Vercel** (frontend + backend) siguiendo la sección 18. Eso ya depende de tu cuenta de Vercel; el código y la config (`vercel.json`, `api/index.js`) están listos.

---

## 21. Pagos con Stripe (arquitectura)

### Decisión de ORM
Se mantiene **`pg` (driver oficial) con SQL parametrizado**, sin ORM. Para un MVP de este tamaño es lo más limpio: cero capa extra, consultas explícitas y seguras (parámetros `$1..$n`, sin SQL injection), y nada de sobreingeniería. Si a futuro se quiere un ORM, **Drizzle** sería el mejor encaje (TypeScript, ligero, SQL-first); Prisma es potente pero más pesado y con build step.

### Modelo de pago (marketplace-ready)
- Al **crear una experiencia** el backend crea automáticamente un **Product** y un **Price** en Stripe y guarda `experiencias.stripe_product_id` y `stripe_price_id` (best-effort: si Stripe falla, la experiencia se guarda igual).
- Al **reservar y pagar**, el backend crea una **Checkout Session** (`mode: payment`) usando el `price` de la experiencia × nº de personas, y registra un `pago` (estado `pendiente`).
- La confirmación se hace por **dos vías** (robusto en local y en prod):
  1. **Webhook** `POST /api/stripe/webhook` (`checkout.session.completed`) — body crudo + verificación de firma con `STRIPE_WEBHOOK_SECRET`.
  2. **Verificación** `GET /api/pagos/verificar/:session_id` que llama el `success_url` al volver de Stripe (no depende del webhook en local).
  Ambas usan la misma función idempotente: marcan `pagos.estado='completado'` y `reservas.estado='confirmada'`.
- **Comisión por guía:** `COMISION_PORCENTAJE` (env) se calcula y guarda en `pagos.comision`. Cuando se quiera cobrar de verdad por guía, se migra a **Stripe Connect** (cuentas conectadas + `application_fee_amount` / transfers). La base ya está lista.

### Columnas añadidas
- `experiencias`: `stripe_product_id`, `stripe_price_id`.
- `pagos`: método `stripe` permitido + `stripe_session_id`, `stripe_payment_intent`, `comision`.

### Endpoints de pago
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/pagos/checkout` | turista | Crea Checkout Session para una reserva; devuelve `url` |
| GET | `/api/pagos/verificar/:session_id` | auth | Confirma el pago al volver del checkout |
| POST | `/api/stripe/webhook` | Stripe | Eventos (body crudo, firma verificada) |

### Variables de entorno
`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `COMISION_PORCENTAJE`, `MONEDA` (cop). Las claves **nunca** se hardcodean; viven en `backend/.env` (gitignored).

### Probar en local
1. Reserva una experiencia y pulsa **"Pagar con tarjeta (Stripe)"** → redirige a Stripe Checkout.
2. Tarjeta de prueba: **4242 4242 4242 4242**, fecha futura, CVC cualquiera.
3. Al volver, `/pago/exito` confirma contra el backend.
4. (Opcional, para webhooks en local) `stripe listen --forward-to localhost:4000/api/stripe/webhook` y pon el `whsec_...` en `STRIPE_WEBHOOK_SECRET`.

### Manejo de errores
- Stripe deshabilitado (sin clave) → 503 claro, la app sigue viva.
- Errores async centralizados en `asyncHandler` + middleware de errores de Express.
- Validaciones: la reserva debe existir y pertenecer al usuario; confirmaciones idempotentes (no duplican pago/estado).
