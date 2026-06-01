# 📋 Historias de Usuario — Muelle Digital

> Semana 1 — Definición y Análisis. Define el **qué** y el **para quién**.
> Formato: *"Como [actor] quiero [acción] para [beneficio]"* + criterios de aceptación.

## Actores del sistema

- **Turista**: persona que busca y reserva experiencias fluviales.
- **Guía / Pescador**: local que ofrece experiencias (previa verificación).
- **Administrador**: gestiona la plataforma, valida guías y modera contenido.

---

## 🧳 Turista

### HU-01 — Registro
**Como** turista **quiero** crear una cuenta **para** poder reservar experiencias.
- ✅ Registro con nombre, email y contraseña.
- ✅ Contraseña mínimo 6 caracteres, almacenada encriptada (bcrypt).
- ✅ Email único; no permite duplicados.
- ✅ Toda cuenta nueva nace como **turista** (seguridad).

### HU-02 — Iniciar sesión
**Como** turista **quiero** iniciar sesión **para** acceder a mis reservas.
- ✅ Login con email + contraseña.
- ✅ Devuelve token JWT que expira en 7 días.
- ✅ Mensaje claro si las credenciales son incorrectas.

### HU-03 — Buscar experiencias
**Como** turista **quiero** filtrar actividades **para** encontrar planes fácilmente.
- ✅ Filtros por texto, ubicación, categoría y precio máximo.
- ✅ Listado con precio, calificación promedio y guía.
- ✅ Vista maestro-detalle (lista + detalle al lado).

### HU-04 — Ver punto de encuentro en el mapa
**Como** turista **quiero** ver en un mapa dónde inicia la experiencia **para** saber a dónde llegar.
- ✅ Mapa interactivo con el pin del punto de encuentro.
- ✅ Nombre del lugar visible (ej. "Muelle de El Llanito").

### HU-05 — Reservar
**Como** turista **quiero** reservar un recorrido **para** asegurar mi cupo.
- ✅ Selección de fecha y número de personas.
- ✅ Validación de cupos disponibles.
- ✅ Estado inicial "pendiente" hasta el pago.

### HU-06 — Pagar
**Como** turista **quiero** pagar en línea **para** confirmar mi reserva.
- ✅ Pago con tarjeta vía **Stripe Checkout** (modo test).
- ✅ Opciones simuladas Nequi/Daviplata con comprobante.
- ✅ Al pagar, la reserva pasa a "confirmada".

### HU-07 — Calificar
**Como** turista **quiero** dejar una reseña **para** ayudar a otros usuarios.
- ✅ Puntuación de 1 a 5 estrellas + comentario opcional.
- ✅ Una reseña por experiencia (se puede actualizar).
- ✅ Las reseñas se actualizan **en tiempo real**.

### HU-08 — Ver mis reservas
**Como** turista **quiero** ver el historial de mis reservas **para** hacerles seguimiento.
- ✅ Lista con fecha, personas, valor y estado.

---

## 🛶 Guía / Pescador

### HU-09 — Solicitar ser guía (verificación)
**Como** usuario **quiero** postularme como guía **para** poder publicar experiencias.
- ✅ Formulario con documento, teléfono, zona y descripción.
- ✅ La solicitud llega al panel del administrador.
- ✅ No puedo publicar hasta que un admin **apruebe** (filtro de seguridad).

### HU-10 — Crear experiencias
**Como** guía verificado **quiero** publicar actividades **para** ofrecer mis servicios.
- ✅ Título, descripción, precio, cupos, categoría, temporada e imagen.
- ✅ **Marcar el punto de encuentro en el mapa** (clic/arrastrar pin).
- ✅ Al crear, se genera automáticamente el producto y precio en Stripe.

### HU-11 — Gestionar reservas
**Como** guía **quiero** ver y administrar las reservas de mis experiencias **para** organizar mi agenda.
- ✅ Listado de reservas recibidas.
- ✅ Confirmar o cancelar reservas.
- ✅ Panel con estadísticas (experiencias, reservas, pendientes).

---

## 🛡️ Administrador

### HU-12 — Revisar solicitudes de guía
**Como** admin **quiero** revisar las postulaciones **para** aprobar solo guías confiables.
- ✅ Apartado "Solicitudes" con los datos del formulario.
- ✅ Aprobar (otorga rol guía) o rechazar (con motivo).

### HU-13 — Control total de la plataforma
**Como** admin **quiero** administrar todo **para** mantener la plataforma sana.
- ✅ Gestión de usuarios (cambiar rol, eliminar).
- ✅ Moderar experiencias, reservas y pagos.
- ✅ Métricas globales (usuarios, ingresos, reservas) + mapa de todos los puntos.

---

## Matriz de trazabilidad (HU → implementación)

| HU | Endpoint(s) backend | Pantalla frontend |
|----|--------------------|-------------------|
| HU-01/02 | `POST /auth/register`, `POST /auth/login` | Registro / Login |
| HU-03 | `GET /experiencias` (filtros) | Catálogo (Home) |
| HU-04/05 | `GET /experiencias/:id`, `POST /reservas` | Detalle de experiencia |
| HU-06 | `POST /pagos/checkout`, `GET /pagos/verificar/:id` | Detalle / Pago éxito |
| HU-07 | `POST /ratings`, `GET /ratings` | Detalle (reseñas en vivo) |
| HU-08 | `GET /reservas` | Mis reservas |
| HU-09 | `POST /solicitudes` | Solicitud de guía |
| HU-10/11 | `POST /experiencias`, `PATCH /reservas/:id/estado` | Panel guía |
| HU-12/13 | `GET/PATCH /solicitudes`, `/admin/*` | Panel admin |
