# Prompt para generar las diapositivas (IA) — Muelle Digital

> Copia TODO el bloque de abajo y pégalo en una IA que cree presentaciones (Gamma, ChatGPT, Gemini, Canva IA, etc.).

---

Actúa como un diseñador experto de presentaciones. Crea una **presentación de diapositivas profesional** para la **sustentación de un proyecto de grado de Ingeniería de Software**. Debe verse moderna, limpia y de nivel universitario.

## PROYECTO
**Muelle Digital** — plataforma web tipo *marketplace* que digitaliza el ecoturismo fluvial en Barrancabermeja (Colombia). Conecta a turistas con guías y pescadores locales verificados para **buscar, reservar, pagar y calificar** experiencias fluviales (avistamiento de manatíes, pesca artesanal, paseos en canoa, aviturismo), con el **punto de encuentro en un mapa**. Está **desplegada en producción**.

- App en vivo: https://muelle-digital.vercel.app
- API: https://muelle-digital-api.vercel.app
- Documentación API (Swagger): https://muelle-digital-api.vercel.app/api/docs

## DISEÑO (OBLIGATORIO)
- **Paleta: BLANCO con MORADO.** Fondo blanco, acentos en morado `#512888` (principal) y `#7841D4` (secundario), fondos suaves en lavanda `#EDE9FD`, texto en gris oscuro `#222222`. Minimalista, mucho espacio en blanco.
- **Usa los ICONOS / LOGOS OFICIALES de cada tecnología** (no genéricos): React, Vite, TailwindCSS, MapLibre GL, OpenStreetMap, Node.js, Express, JWT, PostgreSQL, NeonDB, Stripe, Vercel, Git, GitHub, Swagger/OpenAPI y ClickUp. Muéstralos como logos reconocibles, sobre todo en la diapositiva del stack.
- Tipografía sans-serif moderna (Inter, Montserrat o Poppins). Títulos en morado, contenido en viñetas cortas. Íconos lineales morados para apoyar el texto.
- Coherencia visual en todas las diapositivas; legible para proyector. Incluye el concepto del logo (un **ancla** blanca sobre círculo morado oscuro) en la portada y pie.

## FORMATO DE SALIDA
Entrega ~18 diapositivas. Para CADA diapositiva indica: número, **título**, **contenido en viñetas breves** y **qué logos/íconos incluir**. Idioma: español.

## CONTENIDO POR DIAPOSITIVA

1. **Portada** — "Muelle Digital", subtítulo "Marketplace de experiencias ecoturísticas fluviales". Integrantes: Esteban Merlano (Líder, Backend y Despliegue), Andres Rangel (Base de Datos), Keyner Trujillo (Frontend), Jhon Escobar (QA). Materia: Ingeniería de Software. Logo (ancla). 

2. **El problema** — El ecoturismo fluvial en Barrancabermeja es informal: no hay canal centralizado de reservas, precios poco claros, falta de confianza y sin pagos digitales.

3. **La solución** — Muelle Digital: una plataforma que centraliza la oferta, formaliza a los guías, da reputación y permite reservar y pagar en línea. (Ícono de mapa/río).

4. **Objetivos** — General: desarrollar un marketplace web para reservar y pagar experiencias fluviales. Específicos: reservas con cupos, pagos en línea, reseñas, geolocalización del punto de encuentro y verificación de guías.

5. **Usuarios y roles** — Turista (reserva, paga, califica), Guía/Pescador (publica experiencias, previa verificación), Administrador (verifica guías, gestiona todo). Íconos de personas.

6. **Arquitectura** — Diagrama: Frontend (React) ⟷ API REST (Node/Express) ⟷ Base de datos (PostgreSQL/Neon). Autenticación con JWT en cada petición. Todo desplegado serverless en Vercel. (Diagrama de 3 capas con flechas).

7. **Stack tecnológico** — MOSTRAR LOGOS OFICIALES agrupados: Frontend (React, Vite, TailwindCSS, MapLibre, Axios); Backend (Node.js, Express, JWT, Stripe); Base de datos (PostgreSQL, NeonDB); Despliegue/Herramientas (Vercel, Git, GitHub, Swagger, ClickUp).

8. **Modelo de datos** — Base PostgreSQL con 6 tablas: usuarios, experiencias, reservas, ratings, pagos, solicitudes_guia. Relaciones 1:N, normalizado a 3FN, integridad referencial. (Mini diagrama entidad-relación). Logos: PostgreSQL, Neon.

9. **Funcionalidades clave** — Catálogo con filtros, reservas con control de cupos, reseñas en tiempo real, panel de guía y panel de administrador. Íconos lineales por cada una.

10. **Pagos con Stripe** — Al crear una experiencia se genera el producto y precio en Stripe; al reservar se crea una Checkout Session; confirmación por webhook y verificación (idempotente). Modo de prueba. Logo de Stripe.

11. **Mapas** — El guía marca el punto de encuentro y el turista lo visualiza, con MapLibre GL + OpenStreetMap (gratis, sin API key). Logos: MapLibre, OpenStreetMap. (Imagen de mapa con pin morado).

12. **Seguridad** — Contraseñas cifradas (bcrypt), autenticación JWT por rol, claves en variables de entorno (no en el código), consultas parametrizadas (anti SQL injection) y conexión SSL. Íconos de candado/escudo. Logo JWT.

13. **Metodología SDD + gestión** — Spec-Driven Development: especificar antes de programar, con trazabilidad. 8 semanas / sprints. Control de versiones con Git + GitHub (GitFlow, ramas por rol). Gestión ágil en ClickUp. Logos: Git, GitHub, ClickUp.

14. **El equipo y sus roles** — Esteban Merlano: liderazgo, API/backend y despliegue. Andres Rangel: modelo de base de datos. Keyner Trujillo: frontend y UX/UI. Jhon Escobar: aseguramiento de calidad. (Tarjetas con avatar/ícono por persona).

15. **Calidad y pruebas (QA)** — Plan con 22 casos de prueba (15 funcionales + 7 de seguridad), revisión de código por Pull Requests, 3 bugs encontrados y corregidos, 100% de casos exitosos. Íconos de checklist.

16. **Despliegue** — Vercel (frontend + backend serverless) + NeonDB. Aplicación en vivo (muestra las URLs y, si puedes, un código QR a https://muelle-digital.vercel.app). Variables de entorno cifradas. Logos: Vercel, Neon.

17. **Resultados y trabajo futuro** — Resultados: 13/13 historias de usuario implementadas, producto funcional y desplegado. Futuro: Stripe Connect (comisiones por guía), pruebas automatizadas (CI/CD), app móvil.

18. **Cierre / Gracias** — "Muelle Digital: un producto real, funcional y desplegado." Invitación a la demo en vivo + las URLs. Logo (ancla) centrado en morado.

## TONO
Profesional, claro y conciso. Frases cortas en las viñetas (máximo una línea). Que cada diapositiva tenga aire y se entienda en 10 segundos.
