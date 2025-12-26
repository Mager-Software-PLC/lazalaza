const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

async function verifyAdmin() {
  console.log('🔍 Verifying admin user...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'yeha_Services',
  };

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to database\n');

    // Check if admins table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'admins'");
    if (tables.length === 0) {
      console.error('❌ admins table does not exist!');
      process.exit(1);
    }
    console.log('✅ admins table exists\n');

    // Check admin user
    const [admins] = await connection.query('SELECT id, username, email, role FROM admins');
    
    if (admins.length === 0) {
      console.error('❌ No admin users found in database!');
      console.log('\n💡 Creating admin user...');
      
      // Create admin user with password: admin123
      const bcrypt = require('bcryptjs');
      const password_hash = await bcrypt.hash('admin123', 10);
      
      await connection.query(
        'INSERT INTO admins (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
        ['admin', password_hash, 'admin@lazainternational.com', 'super_admin']
      );
      
      console.log('✅ Admin user created!');
      console.log('   Username: admin');
      console.log('   Password: admin123\n');
    } else {
      console.log('✅ Found admin user(s):\n');
      admins.forEach(admin => {
        console.log(`   ID: ${admin.id}`);
        console.log(`   Username: ${admin.username}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log('');
      });
    }

    console.log('🎉 Admin verification complete!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

verifyAdmin();

