const { sequelize } = require('../config/db');

async function checkMediaTable() {
  try {
    console.log('🔍 Checking media_library table...\n');
    
    // Check if table exists
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'media_library'
    `);
    
    if (tables.length === 0) {
      console.log('❌ media_library table does NOT exist!');
      console.log('\n📋 To fix this, run one of the following:');
      console.log('   1. node backend/sql/setupCMS.js');
      console.log('   2. Or manually run: mysql -u your_user -p your_database < backend/sql/cms_schema.sql\n');
      process.exit(1);
    }
    
    console.log('✅ media_library table exists!\n');
    
    // Check table structure
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'media_library'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('📊 Table structure:');
    console.log('   Columns:', columns.length);
    columns.forEach(col => {
      console.log(`   - ${col.COLUMN_NAME} (${col.DATA_TYPE})`);
    });
    
    // Check for required columns
    const requiredColumns = ['id', 'filename', 'file_path', 'created_at'];
    const columnNames = columns.map(c => c.COLUMN_NAME);
    const missing = requiredColumns.filter(col => !columnNames.includes(col));
    
    if (missing.length > 0) {
      console.log(`\n⚠️  Missing required columns: ${missing.join(', ')}`);
      console.log('   Run the migration script: node backend/scripts/add_updated_at_to_media_library.js');
    } else {
      console.log('\n✅ All required columns are present!');
    }
    
    // Test a simple query
    try {
      const [results] = await sequelize.query('SELECT COUNT(*) as count FROM media_library');
      console.log(`\n✅ Table is accessible! Current records: ${results[0].count}`);
    } catch (err) {
      console.log(`\n❌ Error querying table: ${err.message}`);
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking table:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkMediaTable();

