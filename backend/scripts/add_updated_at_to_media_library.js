const { sequelize } = require('../config/db');

async function runMigration() {
  try {
    console.log('🔄 Running migration: Adding updated_at column to media_library table...');
    
    // Check if column already exists
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'media_library' 
      AND COLUMN_NAME = 'updated_at'
    `);
    
    if (results.length > 0) {
      console.log('✅ Column updated_at already exists in media_library table.');
      process.exit(0);
    }
    
    // Add the column
    await sequelize.query(`
      ALTER TABLE media_library 
      ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
      AFTER created_at
    `);
    
    console.log('✅ Successfully added updated_at column to media_library table!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️  Column already exists, skipping...');
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

runMigration();

