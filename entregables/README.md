# 📚 Entregables del Proyecto — Muelle Digital

> Documentación de sustentación para Ingeniería de Software.
> Proyecto: **Muelle Digital** — marketplace de experiencias ecoturísticas fluviales en Barrancabermeja.

---

## 👥 Equipo y roles

| Integrante | Rol asignado | Entregable (este repo) |
|------------|--------------|------------------------|
| **Esteban Merlano** | 🎯 Líder del Proyecto + Backend + Despliegue a producción | [`01-LIDER-Esteban-Merlano.md`](01-LIDER-Esteban-Merlano.md) |
| **Keyner Trujillo** | 🎨 Frontend (Ingeniero de Software – UI) | [`02-FRONTEND-Keyner-Trujillo.md`](02-FRONTEND-Keyner-Trujillo.md) |
| **Jhon Escobar** | 🧪 QA (Control de Calidad) | [`03-QA-Jhon-Escobar.md`](03-QA-Jhon-Escobar.md) |
| **Andres Rangel** | 🗄️ Base de Datos (Modelado y datos) | [`04-BASE-DE-DATOS-Andres-Rangel.md`](04-BASE-DE-DATOS-Andres-Rangel.md) |

Documentos transversales del equipo:
- [`00-HISTORIAS-DE-USUARIO.md`](00-HISTORIAS-DE-USUARIO.md) — historias de usuario y criterios de aceptación (Semana 1).
- [`05-CLICKUP-entregables-semanales.md`](05-CLICKUP-entregables-semanales.md) — tablero de gestión (ClickUp) y entregables por semana.
- [`06-MANUAL-DE-USUARIO.md`](06-MANUAL-DE-USUARIO.md) — guía de uso de la aplicación (Semana 8).

> 📄 **Versiones en Word:** carpeta [`word/`](word/) (generadas desde estos `.md`; regenerar con `cd _export && npm run build`).
> 📘 **API documentada con Swagger:** con el backend corriendo, abre **`http://localhost:4000/api/docs`** (OpenAPI 3).

---

## 🛠️ Stack tecnológico (qué se usó)

| Capa | Tecnología | Responsable |
|------|------------|-------------|
| **Frontend** | React 18 + Vite 5 + TailwindCSS 3 + React Router 6 + Axios | Keyner |
| **Mapas** | MapLibre GL JS + OpenFreeMap (OpenStreetMap) | Keyner / Esteban |
| **Iconos/UI** | lucide-react, modo claro/oscuro, tema morado de marca | Keyner |
| **Backend** | Node.js + Express (ESM) — API REST | Esteban |
| **Autenticación** | JWT (`jsonwebtoken`) + `bcryptjs`, roles (turista/guía/admin) | Esteban |
| **Pagos** | Stripe (modo test) + Nequi/Daviplata simulados | Esteban |
| **Base de datos** | PostgreSQL en **NeonDB** (driver `pg`) | Andres |
| **Despliegue** | Vercel (frontend + backend serverless) + Neon | Esteban |
| **Control de versiones** | Git + GitHub, flujo **GitFlow** | Todos |
| **Gestión ágil** | ClickUp (tablero + entregables por semana) | Esteban |

---

## 📁 Estructura del proyecto

```
lunes/
├── backend/        ← API REST (Node + Express + PostgreSQL + Stripe)
├── frontend/       ← App React (Vite + Tailwind + MapLibre)
├── entregables/    ← ESTA CARPETA (documentación de sustentación)
└── MUELLE_DIGITAL_MASTER.md   ← documento maestro técnico
```

---

## 🎤 Orden de sustentación sugerido (≈ 20 min total)

1. **Esteban (Líder)** — visión, plan, gestión y arquitectura (3-5 min).
2. **Andres (BD)** — modelo de datos y seguridad de la información (3-5 min).
3. **Keyner (Frontend)** — interfaz, UX y consumo de la API (3-5 min).
4. **Jhon (QA)** — pruebas, bugs y calidad (3-5 min).
5. **Demo final en vivo** + retrospectiva del equipo (5 min).

Cada documento incluye un guion de presentación al final.
