const fs = require('fs');

const rawNames = `
Năng lượng tái tạo
Công nghệ sản xuất tự động
Quản lý công nghiệp
Điện
Công nghệ kỹ thuật cơ điện tử
Công nghệ kỹ thuật điện, điện tử
Công nghệ kỹ thuật điều khiển và tự động hóa
Kỹ thuật điện
Kỹ thuật cơ điện tử
Kỹ thuật Điều khiển - Tự động hoá
Kỹ thuật Nhiệt
Công nghệ kỹ thuật nhiệt
Kỹ thuật Robot
Kỹ thuật robot và trí tuệ nhân tạo
Công nghệ kỹ thuật năng lượng
Tự động hóa
Điện tự động
Kỹ thuật cơ khí, cơ điện
Kỹ thuật Điện - Điện tử
Quản lý năng lượng
Vi mạch bán dẫn
CNKT cơ khí tàu thủy và công trình nổi
Hải quan và Logistics
Khoa học hàng hải
Kỹ thuật xây dựng công trình thủy
Biến đổi khí hậu và Phát triển bền vững
Khí tượng và Khí hậu học
Kinh tế, kỹ thuật, quản lý Hàng Hải
Điều khiển tàu biển
Đóng tàu & công trình ngoài khơi
Hải dương học
Khai thác máy tàu biển
Kỹ thuật biển
Kỹ thuật Tài nguyên nước
Kỹ thuật Tàu thủy
Thiết kế tàu & công trình ngoài khơi
Thủy văn học
Xây dựng công trình thủy
Kỹ thuật, công nghệ Hàng không
Kỹ thuật hạt nhân
Quản lý hoạt động bay
Phi công quân sự
Khoa học thông tin địa không gian
Quản trị kinh doanh hàng không
Kỹ thuật Vật liệu
Công nghệ vật liệu
Khoa học Vật liệu
Công nghệ kỹ thuật Vật liệu xây dựng
Khoa học Vũ trụ và Công nghệ Vệ tinh
Khoa học Y Sinh
Vật liệu thông minh và trí tuệ nhân tạo
Vật liệu tiên tiến và công nghệ nano
Công nghệ Thực phẩm
Đảm bảo chất lượng và an toàn thực phẩm
Kỹ thuật thực phẩm
Quản trị kinh doanh thực phẩm
Khoa học chế biến món ăn
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
