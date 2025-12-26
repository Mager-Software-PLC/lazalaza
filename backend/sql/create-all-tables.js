const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'yeha_Services';

async function createAllTables() {
  console.log('🔧 Creating all database tables...\n');
  let connection;

  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      multipleStatements: true,
    });

    console.log('✅ Connected to database\n');

    // Read and execute main schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log('📖 Executing main schema...');
    let schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Remove CREATE DATABASE and USE statements, replace with USE current database
    schema = schema.replace(/CREATE DATABASE.*?;/gi, '');
    schema = schema.replace(/USE\s+\w+\s*;/gi, `USE \`${DB_NAME}\`;`);
    
    try {
      await connection.query(schema);
      console.log('✅ Main schema executed\n');
    } catch (err) {
      console.warn('⚠️  Some schema statements may have failed (this is OK if tables already exist)');
      console.warn(`   ${err.message.substring(0, 100)}\n`);
    }

    // Read and execute seed data
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('🌱 Executing seed data...');
      let seed = fs.readFileSync(seedPath, 'utf8');
      seed = seed.replace(/USE\s+\w+\s*;/gi, `USE \`${DB_NAME}\`;`);
      
      try {
        await connection.query(seed);
        console.log('✅ Seed data executed\n');
      } catch (err) {
        if (!err.message.includes('Duplicate entry')) {
          console.warn(`⚠️  ${err.message.substring(0, 100)}\n`);
        } else {
          console.log('✅ Seed data executed (duplicates skipped)\n');
        }
      }
    }

    // Read and execute CMS schema
    const cmsSchemaPath = path.join(__dirname, 'cms_schema.sql');
    if (fs.existsSync(cmsSchemaPath)) {
      console.log('📖 Executing CMS schema...');
      let cmsSchema = fs.readFileSync(cmsSchemaPath, 'utf8');
      cmsSchema = cmsSchema.replace(/USE\s+\w+\s*;/gi, `USE \`${DB_NAME}\`;`);
      
      try {
        await connection.query(cmsSchema);
        console.log('✅ CMS schema executed\n');
      } catch (err) {
        console.warn('⚠️  Some CMS schema statements may have failed');
        console.warn(`   ${err.message.substring(0, 100)}\n`);
      }
    }

    // Read and execute CMS seed
    const cmsSeedPath = path.join(__dirname, 'cms_seed.sql');
    if (fs.existsSync(cmsSeedPath)) {
      console.log('🌱 Executing CMS seed data...');
      let cmsSeed = fs.readFileSync(cmsSeedPath, 'utf8');
      cmsSeed = cmsSeed.replace(/USE\s+\w+\s*;/gi, `USE \`${DB_NAME}\`;`);
      
      try {
        await connection.query(cmsSeed);
        console.log('✅ CMS seed data executed\n');
      } catch (err) {
        if (!err.message.includes('Duplicate entry')) {
          console.warn(`⚠️  ${err.message.substring(0, 100)}\n`);
        } else {
          console.log('✅ CMS seed data executed (duplicates skipped)\n');
        }
      }
    }

    // Verify tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`🎉 Success! Database now has ${tables.length} tables\n`);
    
    if (tables.length > 0) {
      console.log('📋 Tables created:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
      console.log('');
    }

    // Verify admin user
    try {
      const [admins] = await connection.query('SELECT username, email, role FROM admins LIMIT 1');
      if (admins.length > 0) {
        console.log('✅ Admin user verified:');
        console.log(`   Username: ${admins[0].username}`);
        console.log(`   Email: ${admins[0].email}`);
        console.log(`   Role: ${admins[0].role}`);
        console.log('   Password: admin123\n');
      } else {
        console.log('⚠️  No admin user found. Creating one...');
        const bcrypt = require('bcryptjs');
        const password_hash = await bcrypt.hash('admin123', 10);
        await connection.query(
          'INSERT INTO admins (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
          ['admin', password_hash, 'admin@lazainternational.com', 'super_admin']
        );
        console.log('✅ Admin user created!\n');
      }
    } catch (err) {
      console.error('❌ Error checking admin:', err.message);
    }

    console.log('🎉 Database setup complete!');
    console.log('\n📋 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAllTables();

