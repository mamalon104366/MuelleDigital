# 🛶 Muelle Digital

Marketplace de experiencias ecoturísticas fluviales en Barrancabermeja.
Conecta turistas con guías y pescadores locales: catálogo, reservas, reseñas y pagos digitales.

> 📘 La documentación completa del proyecto está en **[MUELLE_DIGITAL_MASTER.md](MUELLE_DIGITAL_MASTER.md)**.

## Stack

- **Frontend:** React + Vite + TailwindCSS + Axios
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL (NeonDB)
- **Auth:** JWT + bcrypt

## Estructura

```
lunes/
├── MUELLE_DIGITAL_MASTER.md   ← documento maestro (todo el proyecto)
├── backend/                   ← API REST (Express)
│   └── database/schema.sql    ← SQL para crear las tablas en Neon
└── frontend/                  ← App React
```

## Arranque rápido

### 1) Backend
```bash
cd backend
npm install
copy .env.example .env      # Windows  (o: cp .env.example .env)
# edita .env y pon DATABASE_URL (Neon) + JWT_SECRET
npm run dev                 # http://localhost:4000
```

### 2) Base de datos (NeonDB) — ya conectada
El `.env` ya tiene el `DATABASE_URL` y las tablas están creadas y pobladas.
Para reaplicar el SQL desde el código:
```bash
cd backend && npm run db:setup    # schema.sql + seed.sql contra Neon
```
(o pega `database/schema.sql` y `database/seed.sql` en el SQL Editor de Neon).

### 3) Frontend
```bash
cd frontend
npm install
copy .env.example .env      # VITE_API_URL=http://localhost:4000/api
npm run dev                 # http://localhost:5173
```

## Usuarios de ejemplo (tras correr seed.sql)

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@muelle.co | demo1234 |
| Guía | guia@muelle.co | demo1234 |
| Turista | turista@muelle.co | demo1234 |

## Despliegue (todo en Vercel)

Dos proyectos de Vercel desde el mismo repo:

- **Backend:** root `backend` — ya listo con `api/index.js` + `vercel.json`. Variables: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`.
- **Frontend:** root `frontend` — Vite autodetectado + fallback SPA. Variable: `VITE_API_URL=https://<tu-backend>.vercel.app/api`.
- **DB:** Neon (ya hospedada y conectada).

Detalles paso a paso en el documento maestro, **sección 18**.
