
const fs = require('fs');

try {
    const sportEn = JSON.parse(fs.readFileSync('sport_en.json', 'utf8'));
    let categories;
    let rawData = fs.readFileSync('categories.json', 'utf8');
    // Strip BOM if present
    if (rawData.charCodeAt(0) === 0xFEFF) {
        rawData = rawData.slice(1);
    }

    try {
        categories = JSON.parse(rawData);
    } catch (e) {
        console.warn("JSON parse failed, attempting recovery...");
        // Recovery logic: find the last occurrence of "]" or "}" and assume it's the end of the last valid category
        // This is risky but if the file is truncated, we might scrape back to the last valid closing brace.
        // If the file is valid but has a comma at the end, etc.

        // Simple attempt: regex to find the last valid `} ] }` sequence?
        // Or just blindly append if we trust the structure is Open, entries...

        // Let's try to find the last closing of a category.
        // A category ends with `] }`.

        const lastCategoryEnd = rawData.lastIndexOf(']');
        if (lastCategoryEnd !== -1) {
            const truncated = rawData.substring(0, lastCategoryEnd + 1) + '}}';
            try {
                categories = JSON.parse(truncated);
                console.log("Recovered JSON by truncating to last array end.");
            } catch (e2) {
                console.error("Recovery failed:", e2.message);
                // Last resort: if the file is just totally broken, we start with just Sport?
                // User needs translation. If previous file is garbage, maybe we should just replace it?
                // But I'd hate to delete "History" etc.

                // Another try: maybe execute a node script that evals it with a permissive parser?
                // No, let's just abort if recovery fails and try manual inspection?
                // actually I will just write a new file if it fails completely? No.

                // Let's try one more robust thing:
                // The error might be a trailing comma.
                // formatted: [ ... ], } }
                const fixed = rawData.replace(/,\s*([\]}])/g, '$1');
                try {
                    categories = JSON.parse(fixed);
                    console.log("Recovered JSON by removing trailing commas.");
                } catch (e3) {
                    console.error("Recovery 2 failed:", e3.message);
                    process.exit(1);
                }
            }
        } else {
            console.error("Could not find any category end pattern.");
            process.exit(1);
        }
    }

    if (categories) {
        // Merge Sport
        // sportEn is { "Sport": { ... } }
        Object.assign(categories, sportEn);

        fs.writeFileSync('categories.json', JSON.stringify(categories, null, 2));
        console.log("Successfully merged Sport into categories.json");
    }

} catch (e) {
    console.error("Fatal error:", e.message);
}
