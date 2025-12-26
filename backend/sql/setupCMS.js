const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

async function setupCMS() {
  let connection;

  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
    });

    console.log('✅ Connected to MySQL');

    // Read and execute CMS schema
    const schemaPath = path.join(__dirname, 'cms_schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSQL);
    console.log('✅ CMS tables created');

    // Read and execute CMS seed data
    const seedPath = path.join(__dirname, 'cms_seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seedSQL);
    console.log('✅ CMS seed data inserted');

    console.log('\n🎉 CMS setup complete!');
  } catch (error) {
    console.error('❌ Error setting up CMS:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupCMS();

