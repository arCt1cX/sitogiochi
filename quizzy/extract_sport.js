
const fs = require('fs');

try {
    const data = fs.readFileSync('categorie.json', 'utf8');
    const json = JSON.parse(data);

    if (json.Sport) {
        fs.writeFileSync('sport_it.json', JSON.stringify({ Sport: json.Sport }, null, 2));
        console.log('Sport category extracted to sport_it.json');
    } else {
        console.error('Sport category not found in categorie.json');
    }

} catch (e) {
    console.error('Error extracting Sport:', e.message);
}
