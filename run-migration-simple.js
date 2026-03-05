const fs = require('fs');
const https = require('https');

// Read .env file
const envContent = fs.readFileSync('.env', 'utf8');
const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();
const SUPABASE_SERVICE_KEY = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();

// Read migration file
const migrationSQL = fs.readFileSync('supabase/migrations/20260228000100_fix_all_critical_errors.sql', 'utf8');

console.log('🔄 Running migration...');
console.log('URL:', SUPABASE_URL);

// Parse URL
const url = new URL(SUPABASE_URL + '/rest/v1/rpc/exec_sql');

const postData = JSON.stringify({ query: migrationSQL });

const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ Migration executed successfully!');
      console.log('Response:', data);
    } else {
      console.error('❌ Migration failed!');
      console.error('Status:', res.statusCode);
      console.error('Response:', data);
      
      // Try running via SQL Editor instructions
      console.log('\n📋 Manual Migration Instructions:');
      console.log('1. Go to your Supabase Dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy the contents of: supabase/migrations/20260228000100_fix_all_critical_errors.sql');
      console.log('4. Paste and run the SQL');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.log('\n📋 Manual Migration Instructions:');
  console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy the contents of: supabase/migrations/20260228000100_fix_all_critical_errors.sql');
  console.log('4. Paste and run the SQL');
  process.exit(1);
});

req.write(postData);
req.end();
