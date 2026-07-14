const fs = require('fs');

const rawNames = `
Vật lý Kỹ thuật
Cơ Kỹ thuật
Kỹ thuật công nghiệp
Công nghệ kỹ thuật cơ điện tử
Công nghệ kỹ thuật điện, điện tử
Công nghệ kỹ thuật điều khiển và tự động hóa
Kỹ thuật điện
Kỹ thuật Nhiệt
Công nghệ kỹ thuật nhiệt
Kỹ thuật Robot
Kỹ thuật Điện - Điện tử
Kỹ thuật Vật liệu
Công nghệ vật liệu
Khoa học Vật liệu
Công nghệ kỹ thuật hoá học
Kỹ thuật Hóa học
Vật lý học
Công nghệ truyền thông
Quay phim
Nhiếp ảnh báo chí
Quản trị Marketing
Tổ chức sự kiện
Báo chí
Marketing
Truyền thông Marketing
Quan hệ công chúng
Quản lí giải trí và sự kiện
Quản trị kinh doanh & Marketing
Quản trị thương hiệu
Truền thông, quảng cáo
Truyền thông, quảng cáo
Xuất bản và kinh doanh xuất bản phẩm
Quan hệ quốc tế
Digital Marketing
`;

const existingMajors = JSON.parse(fs.readFileSync('./src/data/majors.json', 'utf8'));

const names = rawNames.split('\n').map(n => n.trim()).filter(n => n.length > 0);
const uniqueNames = [...new Set(names)];

let codeCounter = 7000100;

for (const name of uniqueNames) {
    if (!existingMajors.find(m => m.name === name)) {
        existingMajors.push({
            code: (codeCounter++).toString(),
            name: name
        });
    }
}

fs.writeFileSync('./src/data/majors.json', JSON.stringify(existingMajors, null, 2));
console.log("Updated majors.json with " + existingMajors.length + " total items.");
