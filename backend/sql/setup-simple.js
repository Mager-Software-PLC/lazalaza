const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Simple setup script that asks for credentials if .env doesn't exist
async function setupDatabase() {
  console.log('🚀 YEHA Services Database Setup\n');

  // Try to load .env from root
  const envPath = path.join(__dirname, '..', '..', '.env');
  let DB_HOST = 'localhost';
  let DB_USER = 'root';
  let DB_PASSWORD = '';

  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    DB_HOST = process.env.DB_HOST || 'localhost';
    DB_USER = process.env.DB_USER || 'root';
    DB_PASSWORD = process.env.DB_PASSWORD || '';
    console.log('✅ Loaded .env file');
  } else {
    console.log('⚠️  No .env file found. Using defaults:');
    console.log(`   Host: ${DB_HOST}`);
    console.log(`   User: ${DB_USER}`);
    console.log(`   Password: ${DB_PASSWORD ? '***' : '(empty)'}`);
    console.log('\n💡 Tip: Create a .env file in the root directory with:');
    console.log('   DB_HOST=localhost');
    console.log('   DB_USER=root');
    console.log('   DB_PASSWORD=your_password\n');
  }

  let connection;

  try {
    console.log('📡 Connecting to MySQL...');
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });
    console.log('✅ Connected to MySQL server\n');

    // Read schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    console.log('📖 Reading schema file...');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema statements
    console.log('🔨 Creating database and tables...');
    const statements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.length > 0) {
        try {
          await connection.query(statement);
        } catch (err) {
          if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
            throw err;
          }
        }
      }
    }
    console.log('✅ Database schema created\n');

    // Read and execute seed data
    const seedPath = path.join(__dirname, 'seed.sql');
    if (!fs.existsSync(seedPath)) {
      console.log('⚠️  Seed file not found, skipping seed data');
    } else {
      console.log('🌱 Inserting seed data...');
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
            if (!err.message.includes('Duplicate entry')) {
              console.warn('⚠️  Warning:', err.message);
            }
          }
        }
      }
      console.log('✅ Seed data inserted\n');
    }

    console.log('🎉 Database setup complete!');
    console.log('\n📋 Default admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!\n');

  } catch (error) {
    console.error('\n❌ Error setting up database:');
    console.error('   Message:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Is MySQL running?');
    console.error('   2. Are your credentials correct?');
    console.error('   3. Do you have permission to create databases?');
    console.error('\n💡 Try running:');
    console.error('   mysql -u root -p');
    console.error('   Then: CREATE DATABASE yeha_Services;');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Connection closed');
    }
  }
}

setupDatabase();

