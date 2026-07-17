import * as cheerio from 'cheerio';

async function test() {
  const res = await fetch('https://vi.wikipedia.org/wiki/Danh_s%C3%A1ch_tr%C6%B0%E1%BB%9Dng_trung_h%E1%BB%8Dc_ph%E1%BB%95_th%C3%B4ng_t%E1%BA%A1i_Vi%E1%BB%87t_Nam');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const h3s = $('h3');
  console.log(`Found ${h3s.length} h3 elements`);
  
  const sample = [];
  $('h3').each((i, el) => {
    const province = $(el).find('.mw-headline').text().trim();
    if (province && i < 5) {
      sample.push(province);
    }
  });
  console.log("Sample provinces:", sample);
}

test();
