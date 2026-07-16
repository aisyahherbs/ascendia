import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_SIZE || 20),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false" } : undefined
});

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function withTransaction(work) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool() {
  await pool.end();
}
