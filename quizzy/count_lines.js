
const fs = require('fs');
const json = JSON.parse(fs.readFileSync('remaining_it.json', 'utf8'));

Object.keys(json).forEach(key => {
    const str = JSON.stringify(json[key], null, 2);
    const lines = str.split('\n').length;
    console.log(`${key}: ${lines} lines`);
});
