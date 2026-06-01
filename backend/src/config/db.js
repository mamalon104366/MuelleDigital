import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL no está definida. Configura backend/.env antes de usar la base de datos.');
}

// Pool de conexiones a PostgreSQL (NeonDB).
// Neon requiere SSL; lo activamos solo cuando hay cadena de conexión.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// Helper para ejecutar consultas: query('SELECT ...', [params])
export const query = (text, params) => pool.query(text, params);
