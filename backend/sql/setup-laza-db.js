const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = 'laza-international'; // Correct database name

async function setupLazaDatabase() {
  console.log('🔧 Setting up Laza International database...\n');
  let connection;

  try {
    // First connect without database to create it if needed
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    console.log('✅ Connected to MySQL server\n');

    // Create database if it doesn't exist
    console.log(`🔨 Ensuring database '${DB_NAME}' exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' ready\n`);

    // Switch to the database
    await connection.query(`USE \`${DB_NAME}\``);

    // Create tables in order (respecting foreign keys)
    const tables = [
      // Core tables first (no dependencies)
      `CREATE TABLE IF NOT EXISTS Services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        short_description VARCHAR(500),
        price DECIMAL(10, 2) NOT NULL,
        duration VARCHAR(50),
        group_size VARCHAR(50),
        images JSON,
        highlights JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug)
      )`,
      
      `CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        role ENUM('admin', 'super_admin') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_username (username)
      )`,

      // Tables that depend on Services
      `CREATE TABLE IF NOT EXISTS itinerary (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Service_id INT NOT NULL,
        step_number INT NOT NULL,
        step_title VARCHAR(255),
        step_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (Service_id) REFERENCES Services(id) ON DELETE CASCADE,
        INDEX idx_Service (Service_id)
      )`,

      `CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Service_id INT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        booking_date DATE NOT NULL,
        guests INT NOT NULL DEFAULT 1,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        special_requests TEXT,
        total_price DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Service_id) REFERENCES Services(id) ON DELETE SET NULL,
        INDEX idx_status (status),
        INDEX idx_date (booking_date)
      )`,

      `CREATE TABLE IF NOT EXISTS Service_addons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Service_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (Service_id) REFERENCES Services(id) ON DELETE CASCADE,
        INDEX idx_Service (Service_id)
      )`,

      // Independent tables
      `CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        image_url VARCHAR(500),
        location VARCHAR(255),
        approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_approved (approved),
        INDEX idx_rating (rating)
      )`,

      `CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT NOT NULL,
        replied BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_replied (replied)
      )`,

      // CMS tables
      `CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type ENUM('text', 'number', 'boolean', 'json', 'color', 'image') DEFAULT 'text',
        category VARCHAR(50) DEFAULT 'general',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_key (setting_key),
        INDEX idx_category (category)
      )`,

      `CREATE TABLE IF NOT EXISTS site_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content_key VARCHAR(100) UNIQUE NOT NULL,
        content_value TEXT,
        content_type ENUM('text', 'html', 'markdown') DEFAULT 'text',
        section VARCHAR(50),
        page VARCHAR(50),
        language VARCHAR(10) DEFAULT 'en',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_key (content_key),
        INDEX idx_section (section),
        INDEX idx_page (page)
      )`,

      `CREATE TABLE IF NOT EXISTS theme_colors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        color_name VARCHAR(50) UNIQUE NOT NULL,
        color_value VARCHAR(20) NOT NULL,
        color_category VARCHAR(50) DEFAULT 'primary',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (color_category)
      )`,

      `CREATE TABLE IF NOT EXISTS media_library (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_filename VARCHAR(255),
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(50),
        file_size INT,
        alt_text VARCHAR(255),
        description TEXT,
        category VARCHAR(50),
        uploaded_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (uploaded_by) REFERENCES admins(id) ON DELETE SET NULL,
        INDEX idx_category (category),
        INDEX idx_type (file_type)
      )`,

      `CREATE TABLE IF NOT EXISTS gallery_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        media_id INT NOT NULL,
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (media_id) REFERENCES media_library(id) ON DELETE CASCADE,
        INDEX idx_media (media_id),
        INDEX idx_order (order_index),
        INDEX idx_active (is_active)
      )`,

      `CREATE TABLE IF NOT EXISTS site_features (
        id INT AUTO_INCREMENT PRIMARY KEY,
        feature_key VARCHAR(100) UNIQUE NOT NULL,
        feature_name VARCHAR(255) NOT NULL,
        enabled BOOLEAN DEFAULT TRUE,
        feature_config JSON,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_key (feature_key),
        INDEX idx_enabled (enabled)
      )`,

      `CREATE TABLE IF NOT EXISTS navigation_menu (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(100) NOT NULL,
        href VARCHAR(255) NOT NULL,
        icon VARCHAR(50),
        order_index INT DEFAULT 0,
        visible BOOLEAN DEFAULT TRUE,
        parent_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES navigation_menu(id) ON DELETE SET NULL,
        INDEX idx_order (order_index),
        INDEX idx_visible (visible)
      )`,

      `CREATE TABLE IF NOT EXISTS hero_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title TEXT,
        subtitle TEXT,
        description TEXT,
        primary_button_text VARCHAR(100),
        primary_button_link VARCHAR(255),
        secondary_button_text VARCHAR(100),
        secondary_button_link VARCHAR(255),
        background_video VARCHAR(500),
        background_image VARCHAR(500),
        overlay_opacity DECIMAL(3,2) DEFAULT 0.40,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS section_visibility (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_key VARCHAR(100) UNIQUE NOT NULL,
        section_name VARCHAR(255) NOT NULL,
        visible BOOLEAN DEFAULT TRUE,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_key (section_key),
        INDEX idx_visible (visible),
        INDEX idx_order (order_index)
      )`,

      // Additional tables
      `CREATE TABLE IF NOT EXISTS guides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        bio TEXT,
        image VARCHAR(500),
        facebook_url VARCHAR(500),
        instagram_url VARCHAR(500),
        twitter_url VARCHAR(500),
        linkedin_url VARCHAR(500),
        youtube_url VARCHAR(500),
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS achievements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        value VARCHAR(100) NOT NULL,
        icon VARCHAR(100) NOT NULL DEFAULT 'MapPin',
        gradient VARCHAR(255) NOT NULL DEFAULT 'from-primary-500 to-ocean-500',
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        youtube_url VARCHAR(500) NOT NULL,
        description TEXT,
        thumbnail_url VARCHAR(500),
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(500),
        website_url VARCHAR(500),
        description TEXT,
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS navbar_items (
        id INT(11) NOT NULL AUTO_INCREMENT,
        label VARCHAR(255) NOT NULL,
        href VARCHAR(500) NOT NULL,
        icon VARCHAR(100) DEFAULT NULL,
        order_index INT(11) DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        is_external TINYINT(1) DEFAULT 0,
        target VARCHAR(20) DEFAULT '_self',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_order (order_index),
        KEY idx_active (is_active)
      )`,

      `CREATE TABLE IF NOT EXISTS section_styles (
        id INT(11) NOT NULL AUTO_INCREMENT,
        section_key VARCHAR(100) NOT NULL,
        section_name VARCHAR(255) NOT NULL,
        background_color VARCHAR(50) DEFAULT NULL,
        background_gradient TEXT DEFAULT NULL,
        background_image VARCHAR(500) DEFAULT NULL,
        background_overlay VARCHAR(50) DEFAULT NULL,
        text_color VARCHAR(50) DEFAULT NULL,
        heading_color VARCHAR(50) DEFAULT NULL,
        subheading_color VARCHAR(50) DEFAULT NULL,
        font_family VARCHAR(100) DEFAULT NULL,
        heading_font VARCHAR(100) DEFAULT NULL,
        body_font VARCHAR(100) DEFAULT NULL,
        font_size_base VARCHAR(20) DEFAULT NULL,
        card_background VARCHAR(50) DEFAULT NULL,
        card_border_color VARCHAR(50) DEFAULT NULL,
        card_border_radius VARCHAR(20) DEFAULT NULL,
        card_shadow VARCHAR(100) DEFAULT NULL,
        card_text_color VARCHAR(50) DEFAULT NULL,
        button_background VARCHAR(50) DEFAULT NULL,
        button_text_color VARCHAR(50) DEFAULT NULL,
        button_hover_background VARCHAR(50) DEFAULT NULL,
        custom_styles TEXT DEFAULT NULL,
        is_published TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY section_key (section_key)
      )`,
    ];

    console.log('🔨 Creating tables...');
    let createdCount = 0;
    let existingCount = 0;
    for (const tableSQL of tables) {
      try {
        await connection.query(tableSQL);
        const tableMatch = tableSQL.match(/CREATE TABLE.*?`?(\w+)`?/i);
        if (tableMatch) {
          console.log(`   ✅ ${tableMatch[1]}`);
          createdCount++;
        }
      } catch (err) {
        if (err.message.includes('already exists')) {
          const tableMatch = tableSQL.match(/CREATE TABLE.*?`?(\w+)`?/i);
          if (tableMatch) {
            console.log(`   ⚠️  ${tableMatch[1]} (already exists)`);
            existingCount++;
          }
        } else {
          console.error(`   ❌ Error: ${err.message.substring(0, 80)}`);
        }
      }
    }

    console.log(`\n✅ Tables: ${createdCount} created, ${existingCount} already existed\n`);

    // Create admin user
    console.log('👤 Setting up admin user...');
    const password_hash = await bcrypt.hash('admin123', 10);
    try {
      await connection.query(
        `INSERT INTO admins (username, password_hash, email, role) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
        ['admin', password_hash, 'admin@lazainternational.com', 'super_admin']
      );
      console.log('✅ Admin user ready');
      console.log('   Username: admin');
      console.log('   Password: admin123\n');
    } catch (err) {
      if (err.message.includes('Duplicate entry')) {
        console.log('✅ Admin user already exists\n');
      } else {
        console.error(`❌ Error: ${err.message}`);
      }
    }

    // Verify
    const [tablesList] = await connection.query('SHOW TABLES');
    console.log(`🎉 Database setup complete! ${tablesList.length} tables total\n`);

    // Load seed data from files
    const fs = require('fs');
    const path = require('path');

    // Load CMS seed data
    const cmsSeedPath = path.join(__dirname, 'cms_seed.sql');
    if (fs.existsSync(cmsSeedPath)) {
      console.log('🌱 Loading CMS seed data...');
      let cmsSeed = fs.readFileSync(cmsSeedPath, 'utf8');
      cmsSeed = cmsSeed.replace(/USE\s+\w+\s*;/gi, '');
      
      // Execute seed statements
      const statements = cmsSeed.split(';').filter(s => s.trim().length > 10 && !s.trim().startsWith('--'));
      for (const stmt of statements) {
        try {
          await connection.query(stmt);
        } catch (err) {
          if (!err.message.includes('Duplicate entry')) {
            // Silent skip for duplicates
          }
        }
      }
      console.log('✅ CMS seed data loaded\n');
    }

    console.log('📋 Summary:');
    console.log(`   Database: ${DB_NAME}`);
    console.log(`   Tables: ${tablesList.length}`);
    console.log(`   Admin: admin / admin123\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupLazaDatabase();

