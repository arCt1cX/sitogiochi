
const fs = require('fs');
const cat = process.argv[2];
const dest = process.argv[3];
const json = JSON.parse(fs.readFileSync('remaining_it.json', 'utf8'));

if (json[cat]) {
    const obj = {};
    obj[cat] = json[cat];
    fs.writeFileSync(dest, JSON.stringify(obj, null, 2));
    console.log(`Written to ${dest}`);
} else {
    console.log('Category not found');
}
