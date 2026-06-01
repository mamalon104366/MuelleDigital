import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import experienciasRoutes from './routes/experiencias.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import ratingsRoutes from './routes/ratings.routes.js';
import pagosRoutes from './routes/pagos.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { webhook as stripeWebhook } from './controllers/payments.controller.js';
import { openapiSpec } from './config/openapi.js';

// Swagger UI servido desde CDN (funciona en serverless, sin archivos estáticos locales).
const SWAGGER_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Muelle Digital API — Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({ url: '/api/openapi.json', dom_id: '#swagger-ui' });
    };
  </script>
</body>
</html>`;

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

// --- Webhook de Stripe: requiere el body CRUDO, así que va ANTES de express.json() ---
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// --- Middlewares globales ---
app.use(express.json());

// --- Healthcheck ---
app.get('/', (_req, res) => res.json({ ok: true, service: 'Muelle Digital API', version: '1.0.0', docs: '/api/docs' }));
app.get('/api/health', (_req, res) => res.json({ status: 'up' }));

// --- Documentación interactiva de la API (Swagger UI desde CDN) ---
app.get('/api/openapi.json', (_req, res) => res.json(openapiSpec));
app.get('/api/docs', (_req, res) => res.type('html').send(SWAGGER_HTML));

// --- Rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/experiencias', experienciasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/admin', adminRoutes);

// --- 404 ---
app.use((_req, res) => res.status(404).json({ error: 'Recurso no encontrado.' }));

// --- Manejador de errores centralizado ---
app.use((err, _req, res, _next) => {
  console.error('❌', err.message);
  // Violación de UNIQUE en Postgres
  if (err.code === '23505') {
    return res.status(409).json({ error: 'El registro ya existe (dato duplicado).' });
  }
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor.' });
});

export default app;
