
const fs = require('fs');

function readJsonResult(file) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
    return JSON.parse(content);
}

try {
    const json = readJsonResult('categorie.json');
    const targets = [
        'Alcolici',
        'Economia',
        'Filosofia',
        'Giurisprudenza',
        'Lingue Straniere',
        'Medicina',
        'Patente',
        'Psicologia'
    ];

    const extracted = {};
    let count = 0;

    targets.forEach(key => {
        if (json[key]) {
            extracted[key] = json[key];
            count++;
            console.log(`Found: ${key}`);
        } else {
            console.warn(`Warning: ${key} not found!`);
        }
    });

    fs.writeFileSync('remaining_it.json', JSON.stringify(extracted, null, 2));
    console.log(`Extracted ${count} categories to remaining_it.json`);

} catch (e) {
    console.error('Error extracting:', e.message);
}
