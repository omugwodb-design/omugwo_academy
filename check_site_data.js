import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iquixesxjplgtjirznoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxdWl4ZXN4anBsZ3RqaXJ6bm9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYyNzQ1MCwiZXhwIjoyMDgzMjAzNDUwfQ.-NLo5HR_PO7K0zfyu8LqMft_vw0h1GhdFh5c4QzG57E';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('--- SITE CONFIG ---');
    const { data: config, error: configError } = await supabase.from('site_config').select('*');
    console.log('Error:', configError);
    console.log('Data:', config);

    console.log('\n--- SITE PAGES ---');
    const { data: pages, error: pagesError } = await supabase.from('site_pages').select('*');
    console.log('Error:', pagesError);
    console.log('Data:', pages);
}

check();
