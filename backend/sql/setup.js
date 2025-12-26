const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load .env from root directory (one level up from backend/)
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  // Also try loading from current directory
  require('dotenv').config();
}

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

async function setupDatabase() {
  let connection;

  try {
    // Connect without database
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    console.log('✅ Connected to MySQL server');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.length > 0) {
        try {
          await connection.query(statement);
        } catch (err) {
          // Skip errors for "database already exists" or "table already exists"
          if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
            console.warn('Warning executing statement:', statement.substring(0, 50) + '...');
            console.warn('Error:', err.message);
          }
        }
      }
    }

    console.log('✅ Database schema created');

    // Read and execute seed data
    const seedPath = path.join(__dirname, 'seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');

    const seedStatements = seed
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--') && !s.startsWith('USE'));

    for (const statement of seedStatements) {
      if (statement.length > 0) {
        try {
          await connection.query(statement);
        } catch (err) {
          // Skip errors for duplicate entries
          if (!err.message.includes('Duplicate entry')) {
            console.warn('Warning executing seed statement:', statement.substring(0, 50) + '...');
            console.warn('Error:', err.message);
          }
        }
      }
    }

    console.log('✅ Seed data inserted');
    console.log('🎉 Database setup complete!');
    console.log('\nDefault admin credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\n⚠️  Please change the admin password after first login!');

  } catch (error) {
    console.error('❌ Error setting up database:');
    console.error('Error message:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure MySQL is running');
    console.error('2. Check your .env file exists in the root directory');
    console.error('3. Verify DB credentials in .env:');
    console.error(`   DB_HOST=${DB_HOST}`);
    console.error(`   DB_USER=${DB_USER}`);
    console.error(`   DB_PASSWORD=${DB_PASSWORD ? '***' : '(empty)'}`);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();

