import * as cheerio from 'cheerio';
import fs from 'fs';

async function fetchSchools() {
  try {
    const res = await fetch('https://vi.wikipedia.org/w/api.php?action=parse&page=Danh_s%C3%A1ch_tr%C6%B0%E1%BB%9Dng_trung_h%E1%BB%8Dc_ph%E1%BB%95_th%C3%B4ng_t%E1%BA%A1i_Vi%E1%BB%87t_Nam&prop=text&format=json');
    const data = await res.json();
    const html = data.parse.text['*'];
    
    const $ = cheerio.load(html);
    const result = {};
    let currentProvince = null;
    
    // Wikipedia structure usually has province names in h2 or h3 or span.mw-headline
    $('.mw-headline').each((i, el) => {
      const text = $(el).text().trim();
      // Skip some headers like 'Tham khảo', 'Xem thêm'
      if (text && !['Xem thêm', 'Tham khảo', 'Liên kết ngoài', 'Chú thích'].includes(text)) {
        // Find the next ul or table
        let nextEl = $(el).parent().next();
        const schools = [];
        
        while (nextEl.length > 0 && !nextEl.is('h2') && !nextEl.is('h3')) {
          if (nextEl.is('ul')) {
            nextEl.find('li').each((j, li) => {
              schools.push($(li).text().split(' - ')[0].split(',')[0].trim());
            });
          } else if (nextEl.is('table')) {
            nextEl.find('tr').each((j, tr) => {
              const name = $(tr).find('td').eq(1).text().trim() || $(tr).find('td').eq(0).text().trim();
              if (name && j > 0) schools.push(name);
            });
          }
          nextEl = nextEl.next();
        }
        
        if (schools.length > 0) {
          result[text] = schools;
        }
      }
    });
    
    fs.writeFileSync('public/data/schools.json', JSON.stringify(result, null, 2));
    console.log('Saved to public/data/schools.json. Extracted provinces:', Object.keys(result).length);
  } catch (err) {
    console.error(err);
  }
}

fetchSchools();
