
const fs = require('fs');
const file = 'categorie.json';
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
});

let lineNum = 0;
rl.on('line', (line) => {
    lineNum++;
    if (line.includes('"Sport": {')) {
        console.log(`Found "Sport" at line: ${lineNum}`);
        process.exit(0);
    }
});
