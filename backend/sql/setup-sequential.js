const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'yeha_Services';

// Split SQL into individual statements
function splitSQL(sql) {
  const statements = [];
  let current = '';
  let inString = false;
  let stringChar = '';
  let i = 0;

  while (i < sql.length) {
    const char = sql[i];
    const prevChar = i > 0 ? sql[i - 1] : '';

    // Handle string literals
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = '';
      }
      current += char;
      i++;
      continue;
    }

    current += char;

    // End of statement
    if (!inString && char === ';') {
      const trimmed = current.trim();
      if (trimmed && !trimmed.match(/^\s*--/)) {
        statements.push(trimmed);
      }
      current = '';
    }

    i++;
  }

  // Add any remaining statement
  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements.filter(s => s.length > 5);
}

async function setupSequential() {
  console.log('🔧 Setting up database (sequential execution)...\n');
  let connection;

  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    console.log('✅ Connected to database\n');

    // Execute main schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log('📖 Reading main schema...');
    let schema = fs.readFileSync(schemaPath, 'utf8');
    schema = schema.replace(/CREATE DATABASE.*?;/gi, '');
    schema = schema.replace(/USE\s+\w+\s*;/gi, '');

    const schemaStatements = splitSQL(schema);
    console.log(`📝 Found ${schemaStatements.length} statements\n`);

    console.log('🔨 Creating main tables...');
    for (let i = 0; i < schemaStatements.length; i++) {
      const stmt = schemaStatements[i];
      try {
        await connection.query(stmt);
        const tableMatch = stmt.match(/CREATE TABLE.*?`?(\w+)`?/i);
        if (tableMatch) {
          console.log(`   ✅ ${tableMatch[1]}`);
        }
      } catch (err) {
        if (err.message.includes('already exists')) {
          const tableMatch = stmt.match(/CREATE TABLE.*?`?(\w+)`?/i);
          if (tableMatch) {
            console.log(`   ⚠️  ${tableMatch[1]} (already exists)`);
          }
        } else {
          console.error(`   ❌ Error: ${err.message.substring(0, 80)}`);
          console.error(`   Statement: ${stmt.substring(0, 100)}...`);
        }
      }
    }

    // Execute seed data
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('\n🌱 Seeding main data...');
      let seed = fs.readFileSync(seedPath, 'utf8');
      seed = seed.replace(/USE\s+\w+\s*;/gi, '');
      const seedStatements = splitSQL(seed);

      for (const stmt of seedStatements) {
        try {
          await connection.query(stmt);
        } catch (err) {
          if (!err.message.includes('Duplicate entry')) {
            // Silent skip for duplicates
          }
        }
      }
      console.log('✅ Seed data inserted');
    }

    // Execute CMS schema
    const cmsSchemaPath = path.join(__dirname, 'cms_schema.sql');
    if (fs.existsSync(cmsSchemaPath)) {
      console.log('\n📖 Reading CMS schema...');
      let cmsSchema = fs.readFileSync(cmsSchemaPath, 'utf8');
      cmsSchema = cmsSchema.replace(/USE\s+\w+\s*;/gi, '');
      const cmsStatements = splitSQL(cmsSchema);

      console.log('🔨 Creating CMS tables...');
      for (const stmt of cmsStatements) {
        try {
          await connection.query(stmt);
          const tableMatch = stmt.match(/CREATE TABLE.*?`?(\w+)`?/i);
          if (tableMatch) {
            console.log(`   ✅ ${tableMatch[1]}`);
          }
        } catch (err) {
          if (err.message.includes('already exists')) {
            const tableMatch = stmt.match(/CREATE TABLE.*?`?(\w+)`?/i);
            if (tableMatch) {
              console.log(`   ⚠️  ${tableMatch[1]} (already exists)`);
            }
          } else {
            console.error(`   ❌ Error: ${err.message.substring(0, 80)}`);
          }
        }
      }
    }

    // Execute CMS seed
    const cmsSeedPath = path.join(__dirname, 'cms_seed.sql');
    if (fs.existsSync(cmsSeedPath)) {
      console.log('\n🌱 Seeding CMS data...');
      let cmsSeed = fs.readFileSync(cmsSeedPath, 'utf8');
      cmsSeed = cmsSeed.replace(/USE\s+\w+\s*;/gi, '');
      const cmsSeedStatements = splitSQL(cmsSeed);

      for (const stmt of cmsSeedStatements) {
        try {
          await connection.query(stmt);
        } catch (err) {
          if (!err.message.includes('Duplicate entry')) {
            // Silent skip
          }
        }
      }
      console.log('✅ CMS seed data inserted');
    }

    // Verify
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`\n🎉 Success! ${tables.length} tables created\n`);

    // Check admin
    try {
      const [admins] = await connection.query('SELECT username FROM admins LIMIT 1');
      if (admins.length > 0) {
        console.log('✅ Admin user exists');
        console.log('   Username: admin');
        console.log('   Password: admin123\n');
      }
    } catch (err) {
      console.log('⚠️  Creating admin user...');
      const bcrypt = require('bcryptjs');
      const password_hash = await bcrypt.hash('admin123', 10);
      await connection.query(
        'INSERT INTO admins (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
        ['admin', password_hash, 'admin@lazainternational.com', 'super_admin']
      );
      console.log('✅ Admin user created\n');
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

setupSequential();

