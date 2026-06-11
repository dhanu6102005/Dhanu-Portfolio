// db/setup.js
// Run this once to create the database and tables:
//   node db/setup.js

const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  let conn;
  try {
    console.log('🔧 Starting database setup...');

    // Connect WITHOUT specifying a database first (to create it if needed)
    conn = await mysql.createConnection({
      host:     process.env.DB_HOST     || 'localhost',
      port:     process.env.DB_PORT     || 3306,
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    const dbName = process.env.DB_NAME || 'portfolio_db';

    // 1. Create the database if it doesn't exist
    await conn.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' is ready.`);

    // 2. Switch to that database
    await conn.query(`USE \`${dbName}\``);

    // 3. Create the contacts table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id         INT           NOT NULL AUTO_INCREMENT,
        name       VARCHAR(150)  NOT NULL,
        email      VARCHAR(255)  NOT NULL,
        message    TEXT          NOT NULL,
        created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log(`✅ Table 'contacts' is ready.`);

    console.log('\n🎉 Database setup complete! You can now start the server with:');
    console.log('   npm run dev\n');

  } catch (err) {
    console.error('\n❌ Setup failed:', err.message);
    console.error('   → Make sure MySQL is running and your .env credentials are correct.\n');
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

setupDatabase();
