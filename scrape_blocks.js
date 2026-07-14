import fs from 'fs';
import * as cheerio from 'cheerio';

const url = 'https://diemthi.tuyensinh247.com/to-hop-mon.html';

async function scrape() {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const blocks = [];
    
    // Typically these sites use tables
    $('table tbody tr').each((index, el) => {
      const tds = $(el).find('td');
      if (tds.length >= 2) {
        const cols = [];
        tds.each((i, td) => {
          cols.push($(td).text().trim());
        });
        
        // Find which column has the 3-char code like A00, B00
        let code = '';
        let subjects = '';
        
        for (let i = 0; i < cols.length; i++) {
           if (cols[i].match(/^[A-Z0-9]{3}$/) && !code) {
               code = cols[i];
               // Usually the next column or the one after is the subject list
               if (i + 1 < cols.length && cols[i+1].length > 5) {
                   subjects = cols[i+1];
               } else if (i + 2 < cols.length && cols[i+2].length > 5) {
                   subjects = cols[i+2];
               } else if (i - 1 >= 0 && cols[i-1].length > 5) {
                   subjects = cols[i-1];
               }
           }
        }
        
        // If it didn't find A00 format, maybe it's STT, Ma, Ten
        if (!code && cols.length >= 2) {
           if (cols[0].match(/^\d+$/) && cols[1].match(/^[A-Z0-9]{3}$/)) {
               code = cols[1];
               subjects = cols[2] || '';
           } else if (cols[0].match(/^[A-Z0-9]{3}$/)) {
               code = cols[0];
               subjects = cols[1];
           }
        }
        
        if (code && code.length === 3) {
            blocks.push({
                code: code,
                subjects: subjects.replace(/\s+/g, ' ').trim()
            });
        }
      }
    });

    console.log("Found " + blocks.length + " blocks using table method.");
    if (blocks.length === 0) {
       console.log("Fallback to parsing list elements or generic divs...");
       // Try generic divs that might have "A00:" format
       const text = $('body').text();
       const matches = text.match(/[A-Z][0-9]{2}(\s*:|\s*-|\s+)(.*?)(?=[A-Z][0-9]{2}|$)/g);
       if (matches) {
           console.log("Found matches using regex on body text");
           matches.forEach(m => {
               const parts = m.split(/[:\-]/);
               if (parts.length >= 2) {
                   blocks.push({
                       code: parts[0].trim(),
                       subjects: parts.slice(1).join(':').trim()
                   });
               }
           });
       }
    }
    
    // Deduplicate
    const uniqueBlocks = [];
    const map = new Map();
    for (const item of blocks) {
        if(!map.has(item.code)){
            map.set(item.code, true);
            uniqueBlocks.push(item);
        }
    }
    
    console.log("Unique blocks: " + uniqueBlocks.length);

    if (uniqueBlocks.length > 0) {
        const outPath = './src/data/blocks.json';
        fs.writeFileSync(outPath, JSON.stringify(uniqueBlocks, null, 2));
        console.log("Saved to " + outPath);
    } else {
        console.log("Could not extract any blocks. Printing sample text:");
        console.log($('body').text().substring(0, 1000));
    }
  } catch (err) {
    console.error(err);
  }
}

scrape();
