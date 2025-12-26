const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password hash for "admin123":');
  console.log(hash);
  console.log('\nUpdate the seed.sql file with this hash.');
}

generateHash();

