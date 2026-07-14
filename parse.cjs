const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\34bbcef0-7f87-454a-9a0d-68a80b60780e\\.system_generated\\steps\\141\\content.md', 'utf8');

// Find all matches for "name": "Ngành XXX", "code": "7XXXXXX" or similar.
// In nextjs data, it's often minified json. We can find patterns like 7xxxxxx.

const matches = content.matchAll(/"ma_nganh":"(\w+)","ten_nganh":"([^"]+)"/g);
const majors = [];
const map = new Map();

for (const match of matches) {
    const code = match[1];
    const name = match[2];
    if (!map.has(code) && code.length >= 5) {
        map.set(code, true);
        majors.push({ code, name });
    }
}

if (majors.length === 0) {
    // try another pattern
    const matches2 = content.matchAll(/ma_nganh\\":\\"(\w+)\\",\\"ten_nganh\\":\\"([^"\\]+)\\"/g);
    for (const match of matches2) {
        const code = match[1];
        const name = match[2];
        if (!map.has(code) && code.length >= 5) {
            map.set(code, true);
            majors.push({ code, name });
        }
    }
}

// let's try finding general 7 digit codes followed by name in json arrays
if (majors.length === 0) {
    const regex = /"(\d{7})","([^"]+)"/g; // ["7480201", "Công nghệ thông tin"]
    const matches3 = content.matchAll(regex);
    for (const match of matches3) {
        const code = match[1];
        const name = match[2];
        if (!map.has(code)) {
            map.set(code, true);
            majors.push({ code, name });
        }
    }
}

console.log("Found " + majors.length + " majors");
fs.writeFileSync('d:/Web/src/data/majors.json', JSON.stringify(majors, null, 2));
