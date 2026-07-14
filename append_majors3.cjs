const fs = require('fs');

const rawNames = `
Kỹ thuật an toàn giao thông
Xây dựng dân dụng và công nghiệp
Kinh tế vận tải
Kinh tế Xây dựng
Kỹ thuật xây dựng
Công nghệ kỹ thuật Xây dựng
Công nghệ kỹ thuật giao thông
Kiến trúc
Kiến trúc Cảnh quan
Kiến trúc nội thất
Kỹ thuật cơ sở hạ tầng
Kỹ thuật xây dựng công trình giao thông
Thiết kế nội thất
Quản lý xây dựng
Khai thác vận tải
Đô thị, mỹ thuật đô thị
Quản lý phát triển đô thị và bất động sản
Quản lý, khai thác và bảo trì đường cao tốc
Quy hoạch vùng và đô thị
Thiết kế, quản trị đô thị
Xây dựng, quản lý Cầu - đường sắt
Xây dựng công trình
Xây dựng và quản lý hạ tầng đô thị
Kỹ thuật xây dựng công trình thủy
Ngôn ngữ Tây Ban Nha
Tiếng Anh du lịch
Quan hệ công chúng
Ngôn ngữ Anh
Ngôn ngữ Trung Quốc
Ngôn ngữ Đức
Ngôn ngữ Nga
Ngôn ngữ Nhật
Ngôn ngữ Pháp
Quan hệ quốc tế
Ngôn ngữ Ả Rập
Thương mại quốc tế
Ngôn ngữ Bồ Đào Nha
Ngôn ngữ Hàn Quốc
Ngôn ngữ Italia
Ngôn ngữ Khmer
Ngôn ngữ Thái Lan
Ngôn ngữ và Văn hóa các dân tộc thiểu số Việt Nam
Quản trị kinh doanh & Luật
Tiếng Anh chuyên nghiệp quốc tế
Tiếng Anh KHKT và Công nghệ
Tiếng Anh Thương mại
Tiếng Nhật thương mại
Tiếng Pháp thương mại
Tiếng Trung Thương mại
Văn hóa và truyền thông xuyên quốc gia
Kinh doanh quốc tế
Logistics
Logistics và Quản lý chuỗi cung ứng
Kinh tế đối ngoại
Tài chính quốc tế
Hải quan và Logistics
Quản trị Hải quan - Ngoại thương
Quản trị và Kinh doanh Quốc tế
Truyền thông quốc tế
Quản trị lữ hành, khách sạn
Du lịch
Hướng dẫn du lịch
Quản trị dịch vụ du lịch và lữ hành
Quản trị du lịch và khách sạn
Quản trị khách sạn
Quản trị nhà hàng - khách sạn
Quản trị nhà hàng và dịch vụ ăn uống
Quản trị sự kiện
Quốc tế học
Tài nguyên và Du lịch sinh thái
Văn hóa Du lịch
Địa lý học
công nghệ ô tô điện
Cơ điện tử ô tô
Quản lý công nghiệp
Công nghệ kỹ thuật ô tô
Kỹ thuật ô tô
Công nghệ kỹ thuật cơ khí
Công nghệ chế tạo máy
Công nghệ kỹ thuật
Kỹ thuật cơ điện tử
Kỹ thuật cơ khí
Kỹ thuật cơ khí động lực
Kỹ thuật hệ thống công nghiệp
Vật lý Kỹ thuật
Cơ Kỹ thuật
Kỹ thuật công nghiệp
Công nghệ kỹ thuật cơ điện tử
Thiết kế Công nghiệp
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
    // Capitalize properly if needed, e.g. "công nghệ ô tô điện" -> "Công nghệ ô tô điện"
    if (name === "công nghệ ô tô điện") name = "Công nghệ ô tô điện";
    
    if (!existingMajors.find(m => m.name.toLowerCase() === name.toLowerCase())) {
        existingMajors.push({
            code: (codeCounter++).toString(),
            name: name
        });
    }
}

fs.writeFileSync('./src/data/majors.json', JSON.stringify(existingMajors, null, 2));
console.log("Updated majors.json with " + existingMajors.length + " total items.");
