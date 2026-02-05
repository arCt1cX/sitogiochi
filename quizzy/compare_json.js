
const fs = require('fs');

function readJsonResult(file) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
    return JSON.parse(content);
}

try {
    const it = readJsonResult('categorie.json');
    const en = readJsonResult('categories.json');

    console.log('--- Italian Keys ---');
    console.log(Object.keys(it).sort().join('\n'));
    console.log('\n--- English Keys ---');
    console.log(Object.keys(en).sort().join('\n'));

} catch (e) {
    console.error(e);
}
