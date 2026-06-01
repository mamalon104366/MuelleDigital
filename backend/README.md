# Muelle Digital — Backend (API REST)

Node.js + Express + PostgreSQL (NeonDB) + JWT.

## Instalación

```bash
npm install
cp .env.example .env   # completa DATABASE_URL y JWT_SECRET
npm run dev            # http://localhost:4000
```

## Variables de entorno (.env)

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto (default 4000) |
| `DATABASE_URL` | Cadena de conexión de NeonDB |
| `JWT_SECRET` | Secreto para firmar tokens |
| `JWT_EXPIRES_IN` | Caducidad del token (default `7d`) |
| `CLIENT_URL` | Origen permitido por CORS |

## Endpoints

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/auth/register` | público |
| POST | `/api/auth/login` | público |
| GET | `/api/auth/me` | auth |
| GET | `/api/experiencias` | público |
| GET | `/api/experiencias/:id` | público |
| POST | `/api/experiencias` | guía/admin |
| PUT | `/api/experiencias/:id` | guía dueño/admin |
| DELETE | `/api/experiencias/:id` | guía dueño/admin |
| POST | `/api/reservas` | turista |
| GET | `/api/reservas` | auth (según rol) |
| PATCH | `/api/reservas/:id/estado` | guía/admin |
| GET | `/api/ratings?experiencia_id=` | público |
| POST | `/api/ratings` | turista |
| POST | `/api/pagos` | turista |
| GET | `/api/pagos` | auth (según rol) |

Header de autenticación: `Authorization: Bearer <token>`

## Base de datos

El esquema está en `database/schema.sql` y datos de ejemplo en `database/seed.sql`.
Ejecútalos en el SQL Editor de Neon (primero schema, luego seed).
