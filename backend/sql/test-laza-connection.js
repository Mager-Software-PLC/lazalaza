const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

async function testConnection() {
  console.log('🔍 Testing connection to laza-international database...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'laza-international',
  };

  console.log('📋 Connection settings:');
  console.log(`   Host: ${config.host}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${config.password ? '***' : '(empty)'}`);
  console.log(`   Database: ${config.database}\n`);

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Successfully connected to database!');
    
    // Test a simple query
    const [rows] = await connection.query('SELECT DATABASE() as current_db');
    console.log(`✅ Current database: ${rows[0].current_db}`);
    
    // Check if tables exist
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`✅ Found ${tables.length} tables in database`);
    
    if (tables.length > 0) {
      console.log('\n📊 Tables:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
    }

    // Check admin user
    try {
      const [admins] = await connection.query('SELECT username, email, role FROM admins LIMIT 1');
      if (admins.length > 0) {
        console.log('\n✅ Admin user found:');
        console.log(`   Username: ${admins[0].username}`);
        console.log(`   Email: ${admins[0].email}`);
        console.log(`   Role: ${admins[0].role}`);
        console.log('   Password: admin123');
      }
    } catch (err) {
      console.log('\n⚠️  Could not check admin user:', err.message);
    }
    
    console.log('\n🎉 Database connection test successful!');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`   Error: ${error.message}\n`);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 This is an authentication error. Check your MySQL credentials.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Database does not exist. Run: node backend/sql/setup-laza-db.js');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Cannot connect to MySQL. Make sure XAMPP MySQL is running.');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();

