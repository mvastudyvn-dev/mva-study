import * as cheerio from 'cheerio';
import fs from 'fs';

const url = 'https://diemthi.tuyensinh247.com/nganh-dao-tao.html';

async function scrape() {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const nextDataStr = $('#__NEXT_DATA__').html();
    if (!nextDataStr) {
        console.log("No __NEXT_DATA__ found");
        return;
    }
    
    const nextData = JSON.parse(nextDataStr);
    const pageProps = nextData.props.pageProps;
    
    let majorsList = [];
    
    function findMajors(obj) {
        if (Array.isArray(obj)) {
            for (let i=0; i<obj.length; i++) {
                if (obj[i] && typeof obj[i] === 'object' && obj[i].code_list && obj[i].name) {
                    majorsList.push(obj[i]);
                } else {
                    findMajors(obj[i]);
                }
            }
        } else if (obj !== null && typeof obj === 'object') {
            for (let key in obj) {
                findMajors(obj[key]);
            }
        }
    }
    
    findMajors(pageProps);
    
    console.log("Found raw major objects: " + majorsList.length);
    
    const majors = [];
    const map = new Map();
    
    for (let item of majorsList) {
        const codeMatch = item.code_list.match(/\b(\d{7})\b/);
        if (codeMatch) {
            const code = codeMatch[1];
            if (!map.has(code)) {
                map.set(code, true);
                majors.push({
                    code: code,
                    name: item.name
                });
            }
        }
    }
    
    console.log("Unique extracted majors: " + majors.length);
    if(majors.length > 0) {
        fs.writeFileSync('./src/data/majors.json', JSON.stringify(majors, null, 2));
        console.log("Saved to ./src/data/majors.json");
    }
  } catch (err) {
    console.error(err);
  }
}

scrape();
