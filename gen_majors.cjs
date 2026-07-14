const fs = require('fs');

const rawNames = `
Quản trị tài chính kế toán
Kế toán
Kiểm toán
Kinh tế và quản lý bất động sản
Tài chính
Ngân hàng
Tài chính - Ngân hàng
Bảo hiểm
Bất động sản
Công nghệ tài chính
Thị trường chứng khoán
Đầu tư tài chính
Phân tích dữ liệu kinh doanh
Kinh tế đầu tư
Quản lý tài chính công
Quản trị doanh nghiệp
Quản trị logistics
Thống kê kinh tế
Kinh doanh số
Thương mại số
Kinh doanh
Kinh tế
Quản trị kinh doanh
Logistics và chuỗi cung ứng
Kinh tế phát triển
Kinh tế quốc tế
Kinh tế số
Kinh tế vận tải
Phân tích kinh doanh, tài chính
Hệ thống thông tin quản lý
Quản lý, quản trị
Khoa học quản lý
Quản trị và phân tích dữ liệu
Thẩm định giá và quản trị tài sản
Truyền thông doanh nghiệp
Thương mại điện tử
Tin học
An toàn dữ liệu và an ninh mạng
Công nghệ phần mềm
Công nghệ thông tin
An toàn thông tin
Công nghệ bán dẫn
Công nghệ đa phương tiện
Khoa học Máy tính
Trí tuệ nhân tạo
Công nghệ kỹ thuật điện tử - viễn thông
Công nghệ kỹ thuật máy tính
Công nghệ và đổi mới sáng tạo
Hệ thống nhúng và IoT
Hệ thống thông tin
Khoa học dữ liệu và Trí tuệ nhân tạo
Kỹ thuật dữ liệu
Kỹ thuật điện tử - viễn thông
Kỹ thuật Máy tính
Kỹ thuật phần mềm
Mạng máy tính & truyền thông dữ liệu
Quản lý thông tin
Robot và trí tuệ nhân tạo
Thiết kế vi mạch
Truyền thông đa phương tiện
Cơ học
Hóa học
Khoa học tính toán
Kỹ thuật vật liệu kim loại
An ninh mạng và phòng chống tội phạm công nghệ cao
Công nghệ kỹ thuật cơ khí
Kỹ thuật cơ điện tử
Kỹ thuật cơ khí
`;

const names = rawNames.split('\n').map(n => n.trim()).filter(n => n.length > 0);
const uniqueNames = [...new Set(names)];

let codeCounter = 7000001;
const majors = uniqueNames.map(name => ({
    code: (codeCounter++).toString(),
    name: name
}));

fs.writeFileSync('./src/data/majors.json', JSON.stringify(majors, null, 2));
console.log("Updated majors.json with " + majors.length + " items.");
