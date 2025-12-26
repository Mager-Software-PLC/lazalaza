const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load .env from root directory
const envPath = path.join(__dirname, '..', '..', '.env');
let DB_HOST = 'localhost';
let DB_USER = 'root';
let DB_PASSWORD = '';
let DB_NAME = 'yeha_Services';

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  DB_HOST = process.env.DB_HOST || 'localhost';
  DB_USER = process.env.DB_USER || 'root';
  DB_PASSWORD = process.env.DB_PASSWORD || '';
  DB_NAME = process.env.DB_NAME || 'yeha_Services';
}

async function runAdditionalSQL() {
  console.log('🔧 Running additional SQL scripts...\n');
  let connection;

  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    console.log('✅ Connected to database\n');

    // List of additional SQL files to run
    const sqlFiles = [
      'create_navbar_items_table.sql',
      'create_section_styles_table.sql',
      'add_social_media_to_guides.sql',
      'add_updated_at_to_media_library.sql'
    ];

    for (const sqlFile of sqlFiles) {
      const sqlPath = path.join(__dirname, sqlFile);
      if (fs.existsSync(sqlPath)) {
        console.log(`📖 Running ${sqlFile}...`);
        const sql = fs.readFileSync(sqlPath, 'utf8');
        const statements = sql
          .split(';')
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && !s.startsWith('--') && !s.toUpperCase().startsWith('USE'));

        for (const statement of statements) {
          if (statement.length > 0) {
            try {
              await connection.query(statement);
            } catch (err) {
              if (!err.message.includes('already exists') && 
                  !err.message.includes('Duplicate') &&
                  !err.message.includes("Unknown column") &&
                  !err.message.includes("Duplicate column")) {
                console.warn(`⚠️  Warning in ${sqlFile}: ${err.message}`);
              }
            }
          }
        }
        console.log(`✅ ${sqlFile} completed\n`);
      } else {
        console.log(`⚠️  ${sqlFile} not found, skipping...\n`);
      }
    }

    console.log('🎉 All additional SQL scripts completed!');

  } catch (error) {
    console.error('\n❌ Error running additional SQL:');
    console.error('   Message:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Connection closed');
    }
  }
}

runAdditionalSQL();

