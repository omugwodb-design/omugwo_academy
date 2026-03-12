import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://iquixesxjplgtjirznoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxdWl4ZXN4anBsZ3RqaXJ6bm9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYyNzQ1MCwiZXhwIjoyMDgzMjAzNDUwfQ.-NLo5HR_PO7K0zfyu8LqMft_vw0h1GhdFh5c4QzG57E';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase.from('courses').select('*').limit(1);
    if (error) {
        console.error('Error fetching data:', error);
        return;
    }
    if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        fs.writeFileSync('courses_columns.json', JSON.stringify(columns, null, 2));
        console.log('Columns written to courses_columns.json');
    } else {
        console.log('No data in courses table.');
    }
}

check();
