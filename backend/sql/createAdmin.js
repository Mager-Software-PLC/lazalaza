const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Load .env from root directory
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  require('dotenv').config();
}

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'yeha_Services';

async function createAdmin() {
  console.log('🔐 Creating admin account...\n');

  // Generate password hash
  const password = 'admin123';
  const password_hash = await bcrypt.hash(password, 10);
  console.log('✅ Generated password hash');

  let connection;

  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    console.log('✅ Connected to database');

    // Check if admin exists
    const [existing] = await connection.query(
      'SELECT id FROM admins WHERE username = ?',
      ['admin']
    );

    if (existing.length > 0) {
      // Update existing admin
      await connection.query(
        'UPDATE admins SET password_hash = ? WHERE username = ?',
        [password_hash, 'admin']
      );
      console.log('✅ Updated existing admin password');
    } else {
      // Create new admin
      await connection.query(
        'INSERT INTO admins (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
        ['admin', password_hash, 'admin@yehaServices.com', 'super_admin']
      );
      console.log('✅ Created new admin account');
    }

    console.log('\n🎉 Admin account ready!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Database does not exist. Run: node sql/setup.js first');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Cannot connect to MySQL. Make sure MySQL is running.');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();

