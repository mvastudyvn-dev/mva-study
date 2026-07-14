const fs = require('fs');

const rawNames = `
Công nghệ giáo dục
Sư phạm Toán
Sư phạm Vật lý
Sư phạm Ngữ văn
Sư phạm Tiếng Anh
Sư phạm Hóa học
Sư phạm Sinh học
Sư phạm Lịch sử
Sư phạm Địa lý
Sư phạm Lịch sử - Địa lý
Sư phạm Khoa học tự nhiên
Sư phạm Âm nhạc
Sư phạm Công nghệ
Sư phạm Mỹ thuật
Sư phạm Tiếng Đức
Sư phạm Tiếng H'mong
Sư phạm Tiếng Hàn Quốc
Sư phạm Tiếng Nga
Sư phạm Tiếng Nhật
Sư phạm Tiếng Pháp
Sư phạm Tiếng Trung
Sư phạm Tin học
Sư phạm Kỹ thuật công nghiệp
Giáo dục Chính trị
Giáo dục Công dân
Giáo dục Đặc biệt
Giáo dục học
Giáo dục Mầm non
Giáo dục pháp luật
Giáo dục Quốc phòng - An ninh
Giáo dục Thể chất
Giáo dục Tiểu học
Hỗ trợ giáo dục người khuyết tật
Khoa học Giáo dục và Khác
Quản lý giáo dục
Kỹ thuật phục hình răng
Kỹ thuật Xét nghiệm Y học
Y khoa
Răng Hàm Mặt
Dược học
Điều dưỡng
Y học cổ truyền
Y học dự phòng
Y tế công cộng
Dinh dưỡng
Hóa dược
Hộ Sinh
Khoa học và Công nghệ y khoa
Kỹ thuật hình ảnh y học
Kỹ Thuật Phục Hồi Chức Năng
Quản lý bệnh viện
Vật lý Y khoa
Công nghệ sinh học Y Dược
Công nghệ thẩm mỹ
Dược liệu và hợp chất thiên nhiên
Khúc xạ nhãn khoa
Công nghệ kỹ thuật điện tử y sinh
Thú y
Chăn nuôi
Chăn nuôi thú y
Công nghệ thông tin - CAQĐ
An toàn thông tin - CAQĐ
Y khoa - CAQĐ
An ninh mạng và phòng chống tội phạm công nghệ cao
Biên phòng
Chỉ huy kỹ thuật Công binh
Chỉ huy Kỹ thuật hóa học
Chỉ huy Tham mưu - thông tin
Chỉ huy tham mưu Đặc công
Chỉ huy tham mưu Hải quân
Chỉ huy tham mưu không quân (Phi công quân sự)
Chỉ huy tham mưu Lục quân
Chỉ huy tham mưu Pháo binh
Chỉ huy Tham mưu Phòng không, Không quân và Tác chiến điện tử
Chỉ huy tham mưu Tăng Thiết giáp
Chỉ huy quản lý kỹ thuật
Hậu cần quân sự
Kỹ thuật - Hậu cần
Nghiệp vụ an ninh
Phòng cháy chữa cháy và cứu nạn, cứu hộ
Trinh sát kỹ thuật
Ngôn ngữ Anh - CAQĐ
Ngôn ngữ Trung Quốc - CAQĐ
Ngôn ngữ Nga - CAQĐ
Quan hệ quốc tế - CAQĐ
Kỹ thuật, công nghệ Hàng không - CAQĐ
Luật - CAQĐ
Xây dựng Đảng & CQNN - CAQĐ
Thiết kế mỹ thuật hoạt hình
Công nghệ đa phương tiện
Truyền thông đa phương tiện
Thiết kế Đồ hoạ
Thiết kế Mỹ thuật số
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
