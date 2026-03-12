const fs = require('fs');

async function testKey() {
    const env = fs.readFileSync('.env', 'utf8');
    const match = env.match(/SYSTEME_IO_API_KEY=(.+)/);
    if (!match) {
        console.log("NOT_FOUND");
        return;
    }
    const key = match[1].trim();
    const url = 'https://api.systeme.io/api/contacts';

    console.log(`Testing: ${url} with Bearer`);
    const r1 = await fetch(url, { headers: { 'Authorization': `Bearer ${key}` } });
    console.log(` -> Status: ${r1.status}`);

    console.log(`Testing: ${url} with X-API-Key`);
    const r2 = await fetch(url, { headers: { 'X-API-Key': key } });
    console.log(` -> Status: ${r2.status}`);
}

testKey();
