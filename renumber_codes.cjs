const fs = require('fs');

function renumberFile(filePath) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        const renumberedData = data.map((item, index) => {
            return {
                ...item,
                code: (index + 1).toString()
            };
        });

        fs.writeFileSync(filePath, JSON.stringify(renumberedData, null, 2));
        console.log(`Renumbered ${filePath} - Total items: ${renumberedData.length}`);
    } catch (e) {
        console.error(`Error processing ${filePath}:`, e);
    }
}

renumberFile('./src/data/universities.json');
renumberFile('./src/data/majors.json');
