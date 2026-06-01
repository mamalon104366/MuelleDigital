# 📌 Gestión y Entregables por Semana — ClickUp

> Herramienta de gestión del proyecto (entregable del **Líder**). Usamos **ClickUp** (gratis para equipos pequeños).
> Incluye un **prompt listo** para que la IA de ClickUp ("Brain") cree todo automáticamente.

---

## 1. Estructura en ClickUp

```
Workspace: Muelle Digital
└── Space: Muelle Digital
    └── List: Tablero del proyecto   (vista Tablero/Kanban + vista Gantt)
```

**Estados (Statuses) personalizados de la lista:**
```
Backlog → Por hacer → En progreso → En revisión (PR) → ✅ Hecho
```

**Etiquetas (Tags) por rol:**
`Líder` (morado) · `Frontend` (azul) · `Base de datos` (verde) · `QA` (naranja) · `Bug` (rojo) · `Deploy` (negro)

**Campos personalizados sugeridos:** *Sprint/Semana* (número), *Responsable* (asignado), *Fecha límite*.

---

## 2. 🤖 Prompt para que ClickUp AI ("Brain") lo genere

> En ClickUp: abre tu **List** → botón **AI / Brain** → *Generate tasks* → pega esto:

```
Crea las tareas de un proyecto de software académico llamado "Muelle Digital"
(marketplace de experiencias ecoturísticas fluviales). Equipo de 4:
Esteban Merlano (Líder/Backend/Deploy), Keyner Trujillo (Frontend),
Andres Rangel (Base de datos), Jhon Escobar (QA).
Usa estados: Backlog, Por hacer, En progreso, En revisión, Hecho.
Crea estas tareas agrupadas por semana, con responsable y etiqueta de rol:

Semana 1 (Definición): Historias de usuario (Esteban), Definición de roles (Esteban), Repositorio GitHub + GitFlow (Esteban/Deploy).
Semana 2 (Arquitectura): Diagrama ER (Andres), Prototipo de pantallas (Keyner), Selección del stack (Esteban).
Semana 3 (Sprint 1): Login + registro JWT (Esteban), Conexión NeonDB + esquema (Andres), Estructura frontend + login UI (Keyner).
Semana 4 (Sprint 2): CRUD de experiencias (Esteban), Catálogo + detalle (Keyner), Reservas con cupos (Esteban/Andres).
Semana 5 (Sprint 3): Reseñas en tiempo real (Esteban/Keyner), Pagos con Stripe (Esteban), Mapas punto de encuentro (Keyner).
Semana 6 (Sprint 4): Verificación de guías + panel admin (Esteban), Tema morado + modo claro/oscuro (Keyner).
Semana 7 (QA): Plan y casos de prueba (Jhon), Pruebas de seguridad (Jhon), Code Review por Pull Requests (todos).
Semana 8 (Entrega): Documentación README/diccionario/API Swagger (todos), Manual de usuario (Keyner/Jhon), Despliegue a Vercel (Esteban/Deploy), Demo y sustentación (todos).

Marca como "Hecho" las semanas 1 a 7 y deja la semana 8 "En progreso".
```

> Si tu plan de ClickUp no trae IA, crea las tareas a mano con la lista de la sección 3.

---

## 3. Tareas por semana (para crear a mano si hace falta)

| Semana | Tarea | Responsable | Estado |
|--------|-------|-------------|--------|
| 1 | Historias de usuario | Esteban | ✅ Hecho |
| 1 | Definición de roles | Esteban | ✅ Hecho |
| 1 | Repositorio GitHub + GitFlow | Esteban | ✅ Hecho |
| 2 | Diagrama ER | Andres | ✅ Hecho |
| 2 | Prototipo de pantallas | Keyner | ✅ Hecho |
| 2 | Selección del stack | Esteban | ✅ Hecho |
| 3 | Login + registro (JWT) | Esteban | ✅ Hecho |
| 3 | Conexión NeonDB + esquema | Andres | ✅ Hecho |
| 3 | Estructura frontend + login | Keyner | ✅ Hecho |
| 4 | CRUD experiencias | Esteban | ✅ Hecho |
| 4 | Catálogo + detalle | Keyner | ✅ Hecho |
| 4 | Reservas con cupos | Esteban/Andres | ✅ Hecho |
| 5 | Reseñas en tiempo real | Esteban/Keyner | ✅ Hecho |
| 5 | Pagos con Stripe | Esteban | ✅ Hecho |
| 5 | Mapas (punto de encuentro) | Keyner | ✅ Hecho |
| 6 | Verificación guías + panel admin | Esteban | ✅ Hecho |
| 6 | Tema morado + modo claro/oscuro | Keyner | ✅ Hecho |
| 7 | Plan y casos de prueba | Jhon | ✅ Hecho |
| 7 | Pruebas de seguridad | Jhon | ✅ Hecho |
| 7 | Code Review (PRs) | Todos | ✅ Hecho |
| 8 | Documentación + Swagger | Todos | 🔄 En progreso |
| 8 | Manual de usuario | Keyner/Jhon | ✅ Hecho |
| 8 | Despliegue a Vercel | Esteban | 🔄 En progreso |
| 8 | Demo y sustentación | Todos | 🔄 En progreso |

---

## 4. Ceremonias y métricas

- **Daily (15 min):** ¿Qué hice ayer? ¿Qué haré hoy? ¿Qué me bloquea?
- **Dashboards de ClickUp:** tarjetas de *tareas por estado*, *% completado por semana* y *carga por persona* (velocity).
- **Cierre de sprint** y **retrospectiva** al final de cada semana.

---

## 5. Reglas de Git (GitFlow)

- Nunca *push* directo a `produccion`. Trabajar en ramas por rol → **Pull Request** a `develop`.
- Un compañero revisa (code review) antes de fusionar. `produccion` solo recibe versiones estables (las que despliega Vercel).
