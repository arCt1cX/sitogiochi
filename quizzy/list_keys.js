
const fs = require('fs');

try {
    const itData = JSON.parse(fs.readFileSync('categorie.json', 'utf8'));
    console.log('IT Keys:', Object.keys(itData).join(', '));

    if (fs.existsSync('categories.json')) {
        const enData = JSON.parse(fs.readFileSync('categories.json', 'utf8'));
        console.log('EN Keys:', Object.keys(enData).join(', '));
    } else {
        console.log('categories.json not found');
    }
} catch (err) {
    console.error(err.message);
}
