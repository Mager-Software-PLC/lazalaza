const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'yeha_Services',
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
    
    console.log('\n🎉 Database connection test successful!');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`   Error: ${error.message}\n`);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 This is an authentication error. Possible solutions:');
      console.error('   1. Check if your MySQL root password is correct');
      console.error('   2. If you set a password for root in XAMPP, update DB_PASSWORD in .env');
      console.error('   3. Try connecting with: mysql -u root -p');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Database does not exist. Run: node backend/sql/setup-database.js');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Cannot connect to MySQL. Make sure:');
      console.error('   1. XAMPP MySQL is running');
      console.error('   2. MySQL service is started in XAMPP Control Panel');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();

