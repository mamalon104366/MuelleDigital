// Ejecuta schema.sql y (opcionalmente) seed.sql contra la base de datos.
// Uso:
//   node database/migrate.js          -> schema + seed
//   node database/migrate.js schema   -> solo schema
//   node database/migrate.js seed     -> solo seed
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error('❌ Falta DATABASE_URL en .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const runFile = async (name) => {
  const sql = await readFile(join(__dirname, name), 'utf8');
  await pool.query(sql);
  console.log(`✅ Ejecutado: ${name}`);
};

const main = async () => {
  const arg = process.argv[2]; // schema | seed | undefined
  try {
    if (!arg || arg === 'schema') await runFile('schema.sql');
    if (!arg || arg === 'seed') await runFile('seed.sql');

    // Verificación: conteo de filas por tabla
    const { rows } = await pool.query(`
      SELECT 'usuarios' AS tabla, COUNT(*) FROM usuarios
      UNION ALL SELECT 'experiencias', COUNT(*) FROM experiencias
      UNION ALL SELECT 'reservas', COUNT(*) FROM reservas
      UNION ALL SELECT 'ratings', COUNT(*) FROM ratings
      UNION ALL SELECT 'pagos', COUNT(*) FROM pagos
      ORDER BY tabla;
    `);
    console.log('\n📊 Filas por tabla:');
    rows.forEach((r) => console.log(`   ${r.tabla.padEnd(14)} ${r.count}`));
    console.log('\n🎉 Base de datos lista.');
  } catch (err) {
    console.error('❌ Error en la migración:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

main();
