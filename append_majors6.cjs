const fs = require('fs');

const rawNames = `
Tài nguyên và Du lịch sinh thái
Công nghệ kĩ thuật môi trường
Khoa học môi trường
Kỹ thuật môi trường
Kỹ thuật cấp thoát nước
Quản lý tài nguyên rừng
Quản lý đất đai
Quản lý tài nguyên và môi trường
Tài nguyên và Môi trường
Quản lý tài nguyên
Bảo hộ, an toàn lao động
Kỹ thuật khí thiên nhiên
Kỹ thuật môi trường đô thị
Tài nguyên nước và môi trường
Quản lý biển
Tâm lý học
Tâm lý học giáo dục
Giáo dục Thể chất
Huấn luyện thể thao
Quản lý thể dục thể thao
Công nghệ Dệt May
Công nghệ may
Công nghệ sợi dệt
Kinh doanh thời trang và Dệt may
Thiết kế thời trang
Công nghệ nông nghiệp
Công nghệ chế biến thủy sản
Chăn nuôi thủy sản
Lâm nghiệp
Lâm học
Nông nghiệp
Nông học
Bảo vệ thực vật
Khoa học cây trồng
Kinh doanh nông nghiệp
Nuôi trồng thủy sản
Phát triển nông thôn
Quản lý thủy sản
Công nghệ chế biến lâm sản
Công nghệ sau thu hoạch
Bệnh học thủy sản
Khoa học đất
Khoa học thủy sản
Khuyến nông
Kỹ nghệ gỗ và nội thất
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
