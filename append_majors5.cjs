const fs = require('fs');

const rawNames = `
Công nghệ kỹ thuật in
Kỹ thuật in
Hóa học mỹ phẩm
Công nghệ hóa học
Công nghệ kỹ thuật hoá học
Công nghệ Sinh học
Sinh học
Hoá học
Kỹ thuật Hóa học
Kỹ thuật Sinh học
Kỹ thuật Y Sinh
Sinh học ứng dụng
Luật dân sự và tố tụng dân sự
Luật hiến pháp và luật hành chính
Quản trị kinh doanh & Luật
Luật
Luật hàng hải
Luật hình sự và tố tụng hình sự
Luật kinh doanh
Luật kinh tế
Luật quốc tế
Luật thương mại quốc tế
Quản trị - Luật
Tài chính ngân hàng & Luật
Kỹ thuật trắc địa - bản đồ
Kỹ thuật địa chất
Địa chất học
Công nghệ, kỹ thuật dầu khí
Đá quý Đá mỹ nghệ
Kỹ thuật mỏ
Kỹ thuật địa vật lý
Kỹ thuật tuyển khoáng
Biên đạo múa
CTĐT Nghệ thuật và thiết kế
Sáng tác âm nhạc
Chỉ huy âm nhạc
Biểu diễn nhạc cụ phương Tây
Nhạc Jazz
Nghệ thuật thị giác
Thiết kế sáng tạo
Công nghệ điện ảnh, truyền hình
Diễn viên Kịch - Điện ảnh
Đạo diễn Điện ảnh, Truyền hình
Piano
Thanh nhạc
Điêu khắc
Hội họa
Nhiếp ảnh nghệ thuật
Âm nhạc
Digital Art
Biểu diễn nhạc cụ truyền thống
Công nghệ nghệ thuật (Arttech)
Nghệ thuật học
Nghệ thuật tạo hình đương đại
`;

const existingMajors = JSON.parse(fs.readFileSync('./src/data/majors.json', 'utf8'));

const names = rawNames.split('\n').map(n => n.trim()).filter(n => n.length > 0);
const uniqueNames = [...new Set(names)];

let maxCode = 7000000;
for (const m of existingMajors) {
    if (parseInt(m.code) > maxCode) {
        maxCode = parseInt(m.code);
    }
}
let codeCounter = maxCode + 1;

for (let name of uniqueNames) {
    if (!existingMajors.find(m => m.name.toLowerCase() === name.toLowerCase())) {
        existingMajors.push({
            code: (codeCounter++).toString(),
            name: name
        });
    }
}

fs.writeFileSync('./src/data/majors.json', JSON.stringify(existingMajors, null, 2));
console.log("Updated majors.json with " + existingMajors.length + " total items.");
