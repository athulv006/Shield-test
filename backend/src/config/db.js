import pg from 'pg';
import { newDb } from 'pg-mem';

const { Pool } = pg;

// Standard PostgreSQL configuration with system user default for Homebrew Mac
const currentDbUser = process.env.DB_USER || process.env.USER || 'postgres';
const dbName = process.env.DB_NAME || 'badminton_db';
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${currentDbUser}@localhost:5432/${dbName}`;

let pool = null;
let memDbInstance = null;
let isInMemory = false;

// Initialize connection
async function initDb() {
  if (pool || memDbInstance) return;

  const testPool = new Pool({
    connectionString,
    connectionTimeoutMillis: 2000,
  });

  try {
    const client = await testPool.connect();
    client.release();
    pool = testPool;
    console.log(`Connected successfully to PostgreSQL database server [${dbName}].`);
  } catch (err) {
    console.warn(
      `PostgreSQL connection (${connectionString}) failed: ${err.message}. Using fallback in-memory engine.`
    );
    await testPool.end().catch(() => {});
    
    // Fallback to pg-mem
    memDbInstance = newDb();
    isInMemory = true;
  }
}

export const query = async (text, params = []) => {
  await initDb();
  if (!isInMemory && pool) {
    const res = await pool.query(text, params);
    return res;
  } else if (memDbInstance) {
    try {
      const res = memDbInstance.public.query(text, params);
      return {
        rows: res.rows || [],
        rowCount: res.rowCount || (res.rows ? res.rows.length : 0),
      };
    } catch (err) {
      console.error('SQL Execution Error:', err.message, '\nQuery:', text, params);
      throw err;
    }
  }
};

export const getDbStatus = () => ({
  isInMemory,
  connected: true,
  engine: isInMemory ? 'pg-mem' : 'PostgreSQL 16',
});

export default {
  query,
  getDbStatus,
};
