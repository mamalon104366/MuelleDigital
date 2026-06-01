# 📖 Manual de Usuario — Muelle Digital

Guía rápida para usar la plataforma según tu rol.

---

## Acceso

- **Sitio:** la app web (local: `http://localhost:5173`; en producción: el enlace de Vercel).
- **Cuentas de prueba** (contraseña `demo1234`):
  - Admin: `admin@muelle.co`
  - Guía: `guia@muelle.co`
  - Turista: `turista@muelle.co`
- Botón 🌙/☀️ arriba a la derecha: cambia entre **modo claro y oscuro**.

---

## 🧳 Si eres TURISTA

1. **Regístrate** o inicia sesión (elige "Soy turista").
2. En **Experiencias**, usa los filtros (texto, ubicación, categoría, precio).
3. Haz clic en una experiencia para ver el **detalle**: descripción, **mapa del punto de encuentro** y reseñas.
4. Elige **fecha** y **personas** → **Reservar**.
5. Paga con **tarjeta (Stripe)** usando la tarjeta de prueba `4242 4242 4242 4242` (fecha futura, cualquier CVC), o con Nequi/Daviplata (simulado).
6. Revisa tus reservas en **Mis reservas** y deja una **reseña** con estrellas.

---

## 🛶 Si eres GUÍA

1. Regístrate eligiendo "Soy guía" → llena el **formulario de verificación**.
2. Espera a que un **administrador apruebe** tu solicitud.
3. Una vez aprobado, entra a **Panel guía**:
   - **Crear experiencia:** título, precio, cupos, descripción y **marca el punto de encuentro en el mapa**.
   - **Mis experiencias:** edita o elimina.
   - **Reservas:** confirma o cancela las reservas recibidas.

---

## 🛡️ Si eres ADMINISTRADOR

1. Inicia sesión y entra a **Admin**.
2. **Solicitudes:** revisa las postulaciones de guías y **aprueba/rechaza**.
3. **Usuarios:** cambia roles o elimina cuentas.
4. **Experiencias / Reservas / Pagos:** modera y gestiona.
5. **Resumen:** métricas globales y **mapa con todos los puntos de encuentro**.

---

## Preguntas frecuentes

- **¿Por qué no puedo publicar como guía?** Tu solicitud debe ser aprobada por un admin (medida de seguridad).
- **¿El pago es real?** Está en **modo de prueba** (Stripe test). No se cobra dinero real.
- **¿Dónde veo a dónde llegar?** En el detalle de la experiencia, en el mapa del **punto de encuentro**.
