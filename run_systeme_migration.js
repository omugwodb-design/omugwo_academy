import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://iquixesxjplgtjirznoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxdWl4ZXN4anBsZ3RqaXJ6bm9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYyNzQ1MCwiZXhwIjoyMDgzMjAzNDUwfQ.-NLo5HR_PO7K0zfyu8LqMft_vw0h1GhdFh5c4QzG57E';
const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
    const migrationPath = './supabase/migrations/20260306120000_add_systeme_io_sync_fields.sql';
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Applying migration...');

    // Supabase JS client doesn't have a direct 'query' or 'rpc' for raw SQL unless defined.
    // We can use the Postgres bridge if available, but usually we use a specific RPC for migrations if set up.
    // Alternatively, we can use the 'pg' library since we have the connection string or role.

    // Let's try to see if there is an RPC for raw SQL (not recommended but often exists in dev).
    // If not, I'll use 'pg' if it's in package.json.

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        if (error.message.includes('function "exec_sql" does not exist')) {
            console.log('RPC "exec_sql" not found. Falling back to alternative methods or informing the user.');
            console.log('Please run the SQL migration manually in the Supabase SQL Editor:');
            console.log('------------------------------------------------------------');
            console.log(sql);
            console.log('------------------------------------------------------------');
        } else {
            console.error('Migration failed:', error);
        }
    } else {
        console.log('Migration applied successfully.');
    }
}

applyMigration();
