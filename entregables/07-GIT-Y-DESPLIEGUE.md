# 🌿 Git, ramas y despliegue — Guía rápida

## Modelo de ramas (ya creadas localmente)

| Rama | Propósito |
|------|-----------|
| `produccion` | Lo que **despliega Vercel** (versión estable). |
| `develop` | Integración: aquí se junta el trabajo de todos. |
| `backend` | Trabajo de Esteban (API). |
| `frontend` | Trabajo de Keyner (UI). |
| `base-de-datos` | Trabajo de Andres (modelo de datos). |
| `qa` | Trabajo de Jhon (pruebas). |

> Todas arrancan con el **proyecto completo y funcional** (mismo commit inicial).
> Flujo: cada rol trabaja en su rama → Pull Request a `develop` → cuando está estable, `develop` → `produccion` (deploy).

---

## 1. Subir a GitHub (lo haces tú con tu cuenta)

1. Entra a **github.com** → **New repository** → nombre `muelle-digital` → **NO** marques "Add README/.gitignore" (ya los tenemos) → *Create*.
2. En la terminal, dentro de `C:\Users\mamalon\Desktop\lunes`:

```bash
git remote add origin https://github.com/TU_USUARIO/muelle-digital.git
git push -u origin --all        # sube las 6 ramas
```

3. En GitHub → **Settings → Branches → Default branch** → cámbiala a **`produccion`**.
4. (Recomendado) Protege `produccion` y `develop`: *Settings → Branches → Add rule* → exigir Pull Request.

> Si te pide login, usa tu usuario de GitHub + un **token** (Settings → Developer settings → Personal access tokens) como contraseña.

---

## 2. Desplegar en Vercel (2 proyectos, mismo repo)

> La base de datos ya vive en **Neon**. Solo conectas el repo a Vercel.

### Proyecto A — Backend (API)
- New Project → importa `muelle-digital` → **Root Directory: `backend`**.
- **Production Branch: `produccion`**.
- Variables de entorno (cópialas de tu `backend/.env`):
  - `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `COMISION_PORCENTAJE`, `MONEDA`
  - `CLIENT_URL` = la URL del frontend (la pones después del paso B).
- Deploy → queda en `https://muelle-digital-api.vercel.app` (ejemplo).

### Proyecto B — Frontend
- New Project → mismo repo → **Root Directory: `frontend`**.
- **Production Branch: `produccion`**.
- Variable: `VITE_API_URL` = `https://<tu-backend>.vercel.app/api`.
- Deploy.

### Para que "todo funcione"
- Vuelve al backend y pon `CLIENT_URL` = URL del frontend (para CORS).
- (Opcional) En Stripe, configura el webhook a `https://<tu-backend>.vercel.app/api/stripe/webhook` y copia el `whsec_...` en `STRIPE_WEBHOOK_SECRET`.

---

## 3. Comandos útiles del día a día

```bash
git checkout develop            # cambiar de rama
git checkout -b feature/x        # nueva rama de trabajo
git add -A && git commit -m "..." 
git push origin <rama>
# Pull Request en GitHub: <rama> → develop
```

> ⚠️ El `.env` NO se sube (está en `.gitignore`). En producción las claves van en las **variables de entorno de Vercel**.
