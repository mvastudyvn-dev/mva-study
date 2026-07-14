const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\34bbcef0-7f87-454a-9a0d-68a80b60780e\\.system_generated\\steps\\141\\content.md', 'utf8');

const majors = [];
const map = new Map();

// We know it is a JSON array. Let's find `"alias":"` and try to parse the objects around it.
const objRegex = /"name":"([^"]+)","alias":"[^"]+","description":(?:null|"[^"]*"),"other_infomation":(?:null|"[^"]*"),"created_at":"[^"]+","updated_at":"[^"]+","code_list":"([^"]+)"/g;

let match;
while ((match = objRegex.exec(content)) !== null) {
    const name = match[1];
    const codeList = match[2];
    
    // Extract a 7 digit code from codeList
    const codeMatch = codeList.match(/\b(\d{7})\b/);
    if (codeMatch) {
        const code = codeMatch[1];
        if (!map.has(code)) {
            map.set(code, true);
            majors.push({ code, name });
        }
    }
}

console.log("Found " + majors.length + " majors");
if(majors.length > 0) {
    fs.writeFileSync('d:/Web/src/data/majors.json', JSON.stringify(majors, null, 2));
} else {
    // try to just find `"name":"...","alias":...`
    const regex2 = /"name":"([^"]+)","alias"/g;
    let count = 0;
    while(regex2.exec(content) !== null) count++;
    console.log("Found " + count + " names using loose regex");
}
