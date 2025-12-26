const { sequelize } = require('../config/db');

async function runMigration() {
  try {
    console.log('🔄 Running migration: Adding social media columns to guides table...');
    
    // Check if guides table exists
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'guides'
    `);
    
    if (tables.length === 0) {
      console.log('⚠️  guides table does not exist. It will be created automatically by Sequelize when you create your first guide.');
      console.log('   The social media columns will be included automatically.');
      process.exit(0);
    }
    
    // Check if columns already exist
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'guides' 
      AND COLUMN_NAME IN ('facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url', 'youtube_url')
    `);
    
    const existingColumns = columns.map(c => c.COLUMN_NAME);
    const columnsToAdd = [
      { name: 'facebook_url', after: 'image' },
      { name: 'instagram_url', after: 'facebook_url' },
      { name: 'twitter_url', after: 'instagram_url' },
      { name: 'linkedin_url', after: 'twitter_url' },
      { name: 'youtube_url', after: 'linkedin_url' }
    ].filter(col => !existingColumns.includes(col.name));
    
    if (columnsToAdd.length === 0) {
      console.log('✅ All social media columns already exist in guides table.');
      process.exit(0);
    }
    
    // Add columns one by one
    for (const col of columnsToAdd) {
      try {
        // Check if the 'after' column exists, if not, add after 'image'
        const [afterCol] = await sequelize.query(`
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'guides' 
          AND COLUMN_NAME = ?
        `, { replacements: [col.after] });
        
        const afterClause = afterCol.length > 0 ? `AFTER ${col.after}` : 'AFTER image';
        
        await sequelize.query(`
          ALTER TABLE guides 
          ADD COLUMN ${col.name} VARCHAR(500) NULL ${afterClause}
        `);
        
        console.log(`✅ Added column: ${col.name}`);
      } catch (error) {
        if (error.message.includes('Duplicate column name')) {
          console.log(`ℹ️  Column ${col.name} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('✅ Successfully added social media columns to guides table!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigration();

