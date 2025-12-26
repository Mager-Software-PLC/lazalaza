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
  console.log('✅ Loaded .env file');
} else {
  console.log('⚠️  No .env file found. Using defaults:');
  console.log(`   Host: ${DB_HOST}`);
  console.log(`   User: ${DB_USER}`);
  console.log(`   Password: ${DB_PASSWORD ? '***' : '(empty)'}`);
  console.log(`   Database: ${DB_NAME}\n`);
}

async function setupDatabase() {
  console.log('🚀 Database Setup for Laza International\n');
  let connection;

  try {
    console.log('📡 Connecting to MySQL...');
    // Connect without specifying database first
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });
    console.log('✅ Connected to MySQL server\n');

    // Create database if it doesn't exist
    console.log(`🔨 Creating database '${DB_NAME}' if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' ready\n`);

    // Switch to the database
    await connection.query(`USE \`${DB_NAME}\``);

    // Read and execute main schema
    console.log('📖 Reading main schema file...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    const schemaStatements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--') && !s.toUpperCase().startsWith('CREATE DATABASE') && !s.toUpperCase().startsWith('USE'));

    console.log('🔨 Creating main tables...');
    for (const statement of schemaStatements) {
      if (statement.length > 0) {
        try {
          await connection.query(statement);
        } catch (err) {
          if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
            console.warn(`⚠️  Warning executing statement: ${err.message}`);
          }
        }
      }
    }
    console.log('✅ Main schema created\n');

    // Read and execute seed data
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('🌱 Inserting main seed data...');
      const seed = fs.readFileSync(seedPath, 'utf8');
      const seedStatements = seed
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith('--') && !s.toUpperCase().startsWith('USE'));

      for (const statement of seedStatements) {
        if (statement.length > 0) {
          try {
            await connection.query(statement);
          } catch (err) {
            if (!err.message.includes('Duplicate entry')) {
              console.warn(`⚠️  Warning: ${err.message}`);
            }
          }
        }
      }
      console.log('✅ Main seed data inserted\n');
    }

    // Read and execute CMS schema
    console.log('📖 Reading CMS schema file...');
    const cmsSchemaPath = path.join(__dirname, 'cms_schema.sql');
    if (fs.existsSync(cmsSchemaPath)) {
      const cmsSchema = fs.readFileSync(cmsSchemaPath, 'utf8');
      const cmsSchemaStatements = cmsSchema
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith('--') && !s.toUpperCase().startsWith('USE'));

      console.log('🔨 Creating CMS tables...');
      for (const statement of cmsSchemaStatements) {
        if (statement.length > 0) {
          try {
            await connection.query(statement);
          } catch (err) {
            if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
              console.warn(`⚠️  Warning: ${err.message}`);
            }
          }
        }
      }
      console.log('✅ CMS schema created\n');

      // Read and execute CMS seed data
      const cmsSeedPath = path.join(__dirname, 'cms_seed.sql');
      if (fs.existsSync(cmsSeedPath)) {
        console.log('🌱 Inserting CMS seed data...');
        const cmsSeed = fs.readFileSync(cmsSeedPath, 'utf8');
        const cmsSeedStatements = cmsSeed
          .split(';')
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && !s.startsWith('--') && !s.toUpperCase().startsWith('USE'));

        for (const statement of cmsSeedStatements) {
          if (statement.length > 0) {
            try {
              await connection.query(statement);
            } catch (err) {
              if (!err.message.includes('Duplicate entry')) {
                console.warn(`⚠️  Warning: ${err.message}`);
              }
            }
          }
        }
        console.log('✅ CMS seed data inserted\n');
      }
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
    console.error('   1. Is MySQL/XAMPP running?');
    console.error('   2. Are your credentials correct?');
    console.error('   3. Do you have permission to create databases?');
    console.error(`\n💡 Current settings:`);
    console.error(`   DB_HOST=${DB_HOST}`);
    console.error(`   DB_USER=${DB_USER}`);
    console.error(`   DB_NAME=${DB_NAME}`);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Connection closed');
    }
  }
}

setupDatabase();

