import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iquixesxjplgtjirznoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxdWl4ZXN4anBsZ3RqaXJ6bm9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYyNzQ1MCwiZXhwIjoyMDgzMjAzNDUwfQ.-NLo5HR_PO7K0zfyu8LqMft_vw0h1GhdFh5c4QzG57E';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    console.log('Error:', error);
    console.log('Data:', data);
    if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    }
}

check();
