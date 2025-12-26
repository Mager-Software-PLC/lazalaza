const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

async function diagnose() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };

  let connection;
  try {
    // Connect without database
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL\n');

    // List all databases
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('📊 Available databases:');
    databases.forEach(db => {
      const dbName = Object.values(db)[0];
      console.log(`   - ${dbName}`);
    });
    console.log('');

    // Check if yeha_Services exists
    const dbExists = databases.some(db => Object.values(db)[0] === 'yeha_Services');
    if (!dbExists) {
      console.log('❌ Database "yeha_Services" does not exist!\n');
      console.log('💡 Creating database...');
      await connection.query('CREATE DATABASE IF NOT EXISTS `yeha_Services`');
      console.log('✅ Database created\n');
    } else {
      console.log('✅ Database "yeha_Services" exists\n');
    }

    // Switch to database and check tables
    await connection.query('USE `yeha_Services`');
    const [tables] = await connection.query('SHOW TABLES');
    
    console.log(`📊 Tables in yeha_Services: ${tables.length}`);
    if (tables.length === 0) {
      console.log('❌ No tables found! This is the problem.\n');
      console.log('💡 Running setup script to create tables...\n');
    } else {
      console.log('\n📋 Existing tables:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
      console.log('');
    }

    // If no tables, try to create one manually to test
    if (tables.length === 0) {
      console.log('🧪 Testing table creation...');
      try {
        await connection.query(`
          CREATE TABLE IF NOT EXISTS test_table (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255)
          )
        `);
        console.log('✅ Test table created successfully');
        
        const [newTables] = await connection.query('SHOW TABLES');
        console.log(`📊 Tables now: ${newTables.length}`);
        
        await connection.query('DROP TABLE test_table');
        console.log('✅ Test table cleaned up\n');
      } catch (err) {
        console.error('❌ Failed to create test table:', err.message);
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('   Code:', error.code);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

diagnose();

