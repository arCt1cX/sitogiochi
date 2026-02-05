
const fs = require('fs');
const fileToMerge = process.argv[2];

try {
    const newContent = JSON.parse(fs.readFileSync(fileToMerge, 'utf8'));

    let raw = fs.readFileSync('categories.json', 'utf8');
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);

    const categories = JSON.parse(raw);
    Object.assign(categories, newContent);

    fs.writeFileSync('categories.json', JSON.stringify(categories, null, 2));
    console.log(`Merged ${fileToMerge} into categories.json`);
} catch (e) {
    console.error(e);
}
