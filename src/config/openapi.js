// Especificación OpenAPI 3.0 de la API de Muelle Digital.
// Se sirve con Swagger UI en GET /api/docs
export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Muelle Digital API',
    version: '1.0.0',
    description:
      'API REST del marketplace de experiencias ecoturísticas fluviales. Autenticación con JWT (header `Authorization: Bearer <token>`).',
  },
  servers: [
    { url: 'http://localhost:4000', description: 'Local' },
    { url: '/', description: 'Producción (mismo host)' },
  ],
  tags: [
    { name: 'Auth', description: 'Registro, login y perfil' },
    { name: 'Experiencias', description: 'Catálogo y gestión de experiencias' },
    { name: 'Reservas', description: 'Reservas de experiencias' },
    { name: 'Ratings', description: 'Reseñas y calificaciones' },
    { name: 'Pagos', description: 'Pagos (Stripe + simulados)' },
    { name: 'Solicitudes', description: 'Verificación de guías' },
    { name: 'Admin', description: 'Administración (solo admin)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Laura Turista' },
          email: { type: 'string', example: 'turista@muelle.co' },
          rol: { type: 'string', enum: ['turista', 'guia', 'admin'] },
          telefono: { type: 'string', nullable: true },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          user: { $ref: '#/components/schemas/Usuario' },
        },
      },
      Experiencia: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          titulo: { type: 'string', example: 'Avistamiento de manatíes en El Llanito' },
          descripcion: { type: 'string' },
          precio: { type: 'number', example: 85000 },
          ubicacion: { type: 'string' },
          categoria: { type: 'string', nullable: true },
          temporada: { type: 'string', nullable: true },
          cupos: { type: 'integer', example: 8 },
          imagen: { type: 'string', nullable: true },
          lat: { type: 'number', nullable: true, example: 7.1825 },
          lng: { type: 'number', nullable: true, example: -73.8333 },
          punto_encuentro: { type: 'string', nullable: true },
          guia_nombre: { type: 'string' },
          rating_promedio: { type: 'number', example: 5 },
          total_resenas: { type: 'integer', example: 1 },
        },
      },
      Error: {
        type: 'object',
        properties: { error: { type: 'string', example: 'Mensaje de error' } },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuario (siempre como turista)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre', 'email', 'password'],
                properties: {
                  nombre: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string', minLength: 6 },
                  telefono: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          400: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          409: { description: 'Email duplicado' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: { email: { type: 'string' }, password: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          401: { description: 'Credenciales incorrectas' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Perfil del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'OK' }, 401: { description: 'No autenticado' } },
      },
    },
    '/api/experiencias': {
      get: {
        tags: ['Experiencias'],
        summary: 'Listar experiencias (con filtros)',
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' } },
          { name: 'ubicacion', in: 'query', schema: { type: 'string' } },
          { name: 'categoria', in: 'query', schema: { type: 'string' } },
          { name: 'precio_max', in: 'query', schema: { type: 'number' } },
        ],
        responses: {
          200: { description: 'Lista', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Experiencia' } } } } },
        },
      },
      post: {
        tags: ['Experiencias'],
        summary: 'Crear experiencia (guía/admin) — crea Product+Price en Stripe',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['titulo', 'descripcion', 'precio', 'ubicacion'],
                properties: {
                  titulo: { type: 'string' }, descripcion: { type: 'string' },
                  precio: { type: 'number' }, ubicacion: { type: 'string' },
                  cupos: { type: 'integer' }, categoria: { type: 'string' }, temporada: { type: 'string' },
                  imagen: { type: 'string' }, lat: { type: 'number' }, lng: { type: 'number' },
                  punto_encuentro: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Creada' }, 403: { description: 'Sin permisos' } },
      },
    },
    '/api/experiencias/{id}': {
      get: { tags: ['Experiencias'], summary: 'Detalle de una experiencia', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' }, 404: { description: 'No encontrada' } } },
      put: { tags: ['Experiencias'], summary: 'Editar (dueño/admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' }, 403: { description: 'Sin permisos' } } },
      delete: { tags: ['Experiencias'], summary: 'Eliminar (dueño/admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Eliminada' } } },
    },
    '/api/reservas': {
      get: { tags: ['Reservas'], summary: 'Listar reservas (según rol)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'OK' } } },
      post: {
        tags: ['Reservas'], summary: 'Crear reserva (turista)', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['experiencia_id', 'fecha'], properties: { experiencia_id: { type: 'integer' }, fecha: { type: 'string', format: 'date' }, personas: { type: 'integer' } } } } } },
        responses: { 201: { description: 'Creada' }, 409: { description: 'Sin cupos' } },
      },
    },
    '/api/reservas/{id}/estado': {
      patch: {
        tags: ['Reservas'], summary: 'Cambiar estado (guía/admin)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { estado: { type: 'string', enum: ['pendiente', 'confirmada', 'cancelada', 'completada'] } } } } } },
        responses: { 200: { description: 'OK' } },
      },
    },
    '/api/ratings': {
      get: { tags: ['Ratings'], summary: 'Reseñas de una experiencia', parameters: [{ name: 'experiencia_id', in: 'query', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
      post: {
        tags: ['Ratings'], summary: 'Publicar reseña (turista)', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['experiencia_id', 'puntuacion'], properties: { experiencia_id: { type: 'integer' }, puntuacion: { type: 'integer', minimum: 1, maximum: 5 }, comentario: { type: 'string' } } } } } },
        responses: { 201: { description: 'Creada/actualizada' } },
      },
    },
    '/api/pagos/checkout': {
      post: {
        tags: ['Pagos'], summary: 'Crear Stripe Checkout Session para una reserva', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['reserva_id'], properties: { reserva_id: { type: 'integer' } } } } } },
        responses: { 200: { description: 'URL de checkout', content: { 'application/json': { schema: { type: 'object', properties: { url: { type: 'string' } } } } } } },
      },
    },
    '/api/pagos/verificar/{session_id}': {
      get: { tags: ['Pagos'], summary: 'Verificar/confirmar pago tras el checkout', security: [{ bearerAuth: [] }], parameters: [{ name: 'session_id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Estado del pago' } } },
    },
    '/api/pagos': {
      get: { tags: ['Pagos'], summary: 'Listar pagos (propios; admin todos)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'OK' } } },
    },
    '/api/solicitudes': {
      get: { tags: ['Solicitudes'], summary: 'Listar solicitudes (admin)', security: [{ bearerAuth: [] }], parameters: [{ name: 'estado', in: 'query', schema: { type: 'string', enum: ['pendiente', 'aprobada', 'rechazada'] } }], responses: { 200: { description: 'OK' } } },
      post: {
        tags: ['Solicitudes'], summary: 'Enviar solicitud para ser guía', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['nombre_completo', 'documento', 'telefono', 'zona', 'descripcion'], properties: { nombre_completo: { type: 'string' }, documento: { type: 'string' }, telefono: { type: 'string' }, zona: { type: 'string' }, experiencia_previa: { type: 'string' }, descripcion: { type: 'string' } } } } } },
        responses: { 201: { description: 'Enviada' }, 409: { description: 'Ya tiene solicitud o ya es guía' } },
      },
    },
    '/api/solicitudes/{id}': {
      patch: {
        tags: ['Solicitudes'], summary: 'Aprobar/rechazar solicitud (admin)', security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { estado: { type: 'string', enum: ['aprobada', 'rechazada'] }, motivo_rechazo: { type: 'string' } } } } } },
        responses: { 200: { description: 'Resuelta' } },
      },
    },
    '/api/admin/metrics': {
      get: { tags: ['Admin'], summary: 'Métricas globales', security: [{ bearerAuth: [] }], responses: { 200: { description: 'OK' } } },
    },
    '/api/admin/usuarios': {
      get: { tags: ['Admin'], summary: 'Listar usuarios', security: [{ bearerAuth: [] }], responses: { 200: { description: 'OK' } } },
    },
    '/api/admin/usuarios/{id}/rol': {
      patch: { tags: ['Admin'], summary: 'Cambiar rol de un usuario', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
    },
  },
};
