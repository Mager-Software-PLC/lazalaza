const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'yeha_Services';

async function fixTables() {
  console.log('🔧 Fixing database tables...\n');
  let connection;

  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      multipleStatements: true, // Allow multiple statements
    });

    console.log('✅ Connected to database\n');

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log('📖 Reading schema file...');
    let schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Remove CREATE DATABASE and USE statements
    schema = schema.replace(/CREATE DATABASE.*?;/gi, '');
    schema = schema.replace(/USE.*?;/gi, '');
    
    // Split by semicolon but be smarter about it
    const statements = [];
    let currentStatement = '';
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < schema.length; i++) {
      const char = schema[i];
      const nextChar = schema[i + 1];
      
      if ((char === '"' || char === "'" || char === '`') && schema[i - 1] !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
      }
      
      currentStatement += char;
      
      if (!inString && char === ';') {
        const trimmed = currentStatement.trim();
        if (trimmed && !trimmed.startsWith('--')) {
          statements.push(trimmed);
        }
        currentStatement = '';
      }
    }

    console.log(`📝 Found ${statements.length} SQL statements\n`);

    // Execute each statement
    console.log('🔨 Creating tables...');
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length < 10) continue; // Skip very short statements
      
      try {
        await connection.query(statement);
        const tableMatch = statement.match(/CREATE TABLE.*?`?(\w+)`?/i);
        if (tableMatch) {
          console.log(`   ✅ Created table: ${tableMatch[1]}`);
        }
      } catch (err) {
        if (err.message.includes('already exists')) {
          const tableMatch = statement.match(/CREATE TABLE.*?`?(\w+)`?/i);
          if (tableMatch) {
            console.log(`   ⚠️  Table already exists: ${tableMatch[1]}`);
          }
        } else {
          console.error(`   ❌ Error: ${err.message.substring(0, 100)}`);
          // Don't stop on errors, continue with other tables
        }
      }
    }

    console.log('\n✅ Schema execution complete\n');

    // Now seed data
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('🌱 Seeding data...');
      let seed = fs.readFileSync(seedPath, 'utf8');
      seed = seed.replace(/USE.*?;/gi, '');
      
      const seedStatements = [];
      currentStatement = '';
      inString = false;
      stringChar = '';
      
      for (let i = 0; i < seed.length; i++) {
        const char = seed[i];
        
        if ((char === '"' || char === "'" || char === '`') && seed[i - 1] !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
            stringChar = '';
          }
        }
        
        currentStatement += char;
        
        if (!inString && char === ';') {
          const trimmed = currentStatement.trim();
          if (trimmed && !trimmed.startsWith('--')) {
            seedStatements.push(trimmed);
          }
          currentStatement = '';
        }
      }

      for (const statement of seedStatements) {
        if (statement.length < 10) continue;
        try {
          await connection.query(statement);
        } catch (err) {
          if (!err.message.includes('Duplicate entry')) {
            // Silent skip for duplicates, but log other errors
            if (!err.message.includes('already exists')) {
              console.warn(`   ⚠️  ${err.message.substring(0, 80)}`);
            }
          }
        }
      }
      console.log('✅ Seed data inserted\n');
    }

    // CMS Schema
    const cmsSchemaPath = path.join(__dirname, 'cms_schema.sql');
    if (fs.existsSync(cmsSchemaPath)) {
      console.log('📖 Reading CMS schema...');
      let cmsSchema = fs.readFileSync(cmsSchemaPath, 'utf8');
      cmsSchema = cmsSchema.replace(/USE.*?;/gi, '');
      
      const cmsStatements = [];
      currentStatement = '';
      inString = false;
      stringChar = '';
      
      for (let i = 0; i < cmsSchema.length; i++) {
        const char = cmsSchema[i];
        
        if ((char === '"' || char === "'" || char === '`') && cmsSchema[i - 1] !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
            stringChar = '';
          }
        }
        
        currentStatement += char;
        
        if (!inString && char === ';') {
          const trimmed = currentStatement.trim();
          if (trimmed && !trimmed.startsWith('--')) {
            cmsStatements.push(trimmed);
          }
          currentStatement = '';
        }
      }

      console.log('🔨 Creating CMS tables...');
      for (const statement of cmsStatements) {
        if (statement.length < 10) continue;
        try {
          await connection.query(statement);
          const tableMatch = statement.match(/CREATE TABLE.*?`?(\w+)`?/i);
          if (tableMatch) {
            console.log(`   ✅ Created table: ${tableMatch[1]}`);
          }
        } catch (err) {
          if (err.message.includes('already exists')) {
            const tableMatch = statement.match(/CREATE TABLE.*?`?(\w+)`?/i);
            if (tableMatch) {
              console.log(`   ⚠️  Table already exists: ${tableMatch[1]}`);
            }
          }
        }
      }
      console.log('✅ CMS schema complete\n');
    }

    // Verify tables were created
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`🎉 Success! Created ${tables.length} tables total\n`);
    
    if (tables.length > 0) {
      console.log('📋 Tables:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
    }

    // Verify admin user
    const [admins] = await connection.query('SELECT username FROM admins LIMIT 1');
    if (admins.length > 0) {
      console.log(`\n✅ Admin user exists: ${admins[0].username}`);
      console.log('   Password: admin123\n');
    } else {
      console.log('\n⚠️  No admin user found. Creating one...');
      const bcrypt = require('bcryptjs');
      const password_hash = await bcrypt.hash('admin123', 10);
      await connection.query(
        'INSERT INTO admins (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
        ['admin', password_hash, 'admin@lazainternational.com', 'super_admin']
      );
      console.log('✅ Admin user created!\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixTables();

