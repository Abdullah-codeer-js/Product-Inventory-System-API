require('dotenv').config();
const { Pool } = require('pg');

const baseConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432)
};

const adminPool = new Pool({ ...baseConfig, database: 'postgres' });
const dbName = process.env.DB_NAME;

async function ensureDatabase() {
  const result = await adminPool.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName]
  );

  if (result.rowCount === 0) {
    await adminPool.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database "${dbName}" created.`);
  } else {
    console.log(`Database "${dbName}" already exists.`);
  }
}

async function initTable() {
  const pool = new Pool({ ...baseConfig, database: dbName });

  const query = `
    CREATE TABLE IF NOT EXISTS products (
      product_id SERIAL PRIMARY KEY,
      prod_name VARCHAR(255) NOT NULL,
      price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
      valid_date DATE NOT NULL,
      sku VARCHAR(100) UNIQUE NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity >= 0),
      category VARCHAR(100) NOT NULL
    );
  `;

  await pool.query(query);
  console.log('Table "products" is ready.');

  const result = await pool.query('SELECT * FROM products LIMIT 5');
  console.log('Query check:', result.rows);

  await pool.end();
}

async function main() {
  try {
    await ensureDatabase();
    await initTable();
  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await adminPool.end();
  }
}

main();
