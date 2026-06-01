// Punto de entrada para Vercel (Serverless Function).
// Reutiliza la misma app de Express; Vercel se encarga del "listen".
import app from '../src/app.js';

export default app;
