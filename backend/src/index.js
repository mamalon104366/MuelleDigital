// Punto de entrada para desarrollo local (arranca el servidor).
// En Vercel se usa api/index.js, que importa la misma app sin "listen".
import app from './app.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🛶 Muelle Digital API escuchando en http://localhost:${PORT}`);
});
