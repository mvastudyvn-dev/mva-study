const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\34bbcef0-7f87-454a-9a0d-68a80b60780e\\.system_generated\\steps\\141\\content.md', 'utf8');

const idx3 = content.indexOf("Kế toán");
if (idx3 !== -1) {
    console.log(content.substring(Math.max(0, idx3 - 200), idx3 + 200));
} else {
    console.log("Not found Kế toán");
}
