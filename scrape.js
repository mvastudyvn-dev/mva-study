import fs from 'fs';
import * as cheerio from 'cheerio';

const url = 'https://thi.tuyensinh247.com/danh-sach-truong-dai-hoc-tai-viet-nam-phan-chia-theo-vung-mien-c24a80591.html';

async function scrape() {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const universities = [];
    
    // In tuyensinh247, the data might be in tables
    $('table tbody tr').each((index, el) => {
      const tds = $(el).find('td');
      if (tds.length >= 3) {
        const cols = [];
        tds.each((i, td) => {
          cols.push($(td).text().trim());
        });
        
        // Typical structure: [STT, Tên trường, Mã trường] or [STT, Mã trường, Tên trường]
        if (cols.length >= 3 && cols[0].match(/^\d+$/)) {
           let code, name;
           // Find which column is the code (typically 3 letters uppercase)
           if (cols[1].match(/^[A-Z0-9]{2,5}$/)) {
               code = cols[1];
               name = cols[2];
           } else if (cols[2].match(/^[A-Z0-9]{2,5}$/)) {
               code = cols[2];
               name = cols[1];
           } else if (cols.length >= 4 && cols[3].match(/^[A-Z0-9]{2,5}$/)) {
               code = cols[3];
               name = cols[2];
           } else {
               // Fallback if regex doesn't match perfectly
               code = cols[2].length < cols[1].length ? cols[2] : cols[1];
               name = cols[2].length < cols[1].length ? cols[1] : cols[2];
           }
           
           universities.push({
             code: code,
             name: name,
           });
        }
      }
    });

    console.log("Found " + universities.length + " universities using table method.");
    if (universities.length === 0) {
       console.log("Fallback to parsing links or specific elements...");
       $('table').each((i, table) => {
           console.log("Table " + i + ": " + $(table).find('tr').first().text().substring(0, 50));
       });
    } else {
        const outPath = './src/data/universities.json';
        if (!fs.existsSync('./src/data')) {
            fs.mkdirSync('./src/data', { recursive: true });
        }
        fs.writeFileSync(outPath, JSON.stringify(universities, null, 2));
        console.log("Saved to " + outPath);
    }
  } catch (err) {
    console.error(err);
  }
}

scrape();
