import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = 'https://iquixesxjplgtjirznoa.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxdWl4ZXN4anBsZ3RqaXJ6bm9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYyNzQ1MCwiZXhwIjoyMDgzMjAzNDUwfQ.-NLo5HR_PO7K0zfyu8LqMft_vw0h1GhdFh5c4QzG57E';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    const migrationPath = join(__dirname, '../supabase/migrations/20260228000000_create_site_builder_tables.sql');
    const sql = readFileSync(migrationPath, 'utf-8');
    
    console.log('Running migration: 20260228000000_create_site_builder_tables.sql');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
    
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

runMigration();
