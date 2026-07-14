const fs = require('fs');

const rawNames = `
Toán học
Toán Kinh tế
Toán ứng dụng
Thống kê kinh doanh
Toán tin
Thống kê
Toán tài chính
Quản lý công
Quản trị nhân lực
Quản trị văn phòng
Hệ thống hoạch định nguồn lực doanh nghiệp
Quan hệ lao động
Di sản
Quốc tế học
Văn hóa học
Quản lý văn hóa
Chính trị học
Văn học
Việt Nam Học
Xã hội học
Xây dựng Đảng & CQNN
Đông phương học
Công tác xã hội, thanh thiếu niên
Đông Nam Á học
Lịch sử
Ngôn ngữ học
Trung Quốc học
Hán Quốc học
Nhật Bản học
Quản lý công, nhà nước
Thông tin - Thư viện
Triết học
Kinh tế chính trị
Lưu trữ học
Tiếng Việt & Văn hóa Việt Nam
Hán - Nôm
Nhân học
Bảo tàng học
Tôn giáo học
Giới và phát triển
Nghiên cứu phát triển
Hoa Kỳ học
Quản lý phân tích dữ liệu khoa học trái đất
Khoa học tự nhiên tích hợp
Công nghệ Vật lý điện tử và tin học
Địa lý học
Vật lý học
Công nghệ điện tử, vi mạch và bán dẫn
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
