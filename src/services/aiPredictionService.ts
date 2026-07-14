export interface PredictionRequest {
  score: string;
  blocks: any[];
  universities: any[];
  majors: any[];
}

export interface PredictionResult {
  universities: {
    name: string;
    majors: {
      name: string;
      predicted_benchmark: number;
      chance: string;
      probability: number;
      advice: string;
    }[];
  }[];
  overall_advice: string;
}

export const aiPredictionService = async (request: PredictionRequest): Promise<PredictionResult> => {
  const { score, blocks, universities, majors } = request;

  const uniNames = universities.length > 0 ? universities.map(u => u.name).join(', ') : 'Tất cả các trường';
  const majorNames = majors.length > 0 ? majors.map(m => m.name).join(', ') : 'Tất cả các ngành (hãy tự chọn 2-3 ngành phù hợp)';
  const blockNames = blocks.length > 0 ? blocks.map(b => `${b.code} (${b.subjects})`).join(', ') : 'Chưa xác định khối thi';

  const promptText = `
Bạn là một chuyên gia tư vấn tuyển sinh đại học Việt Nam xuất sắc, với khả năng phân tích cực kỳ logic và thực tế.
Dữ liệu của học sinh:
- Điểm thi dự kiến/thực tế: ${score}
- Khối thi: ${blockNames}
- Trường mục tiêu: ${uniNames}
- Ngành mục tiêu: ${majorNames}

Hãy dựa vào hiểu biết của bạn về phổ điểm chuẩn các năm gần đây của các trường đại học tại Việt Nam để dự đoán khả năng đỗ của học sinh này vào từng ngành của từng trường được liệt kê (hoặc nếu học sinh không chọn cụ thể, hãy tự gợi ý 3 ngành/trường phù hợp nhất với mức điểm đó).
Nếu điểm số của học sinh không hợp lý (ví dụ > 30 mà không có điểm ưu tiên, hoặc bằng chữ), hãy nhẹ nhàng nhắc nhở trong overall_advice và đưa ra một dự đoán mang tính minh họa.

CHỈ TRẢ VỀ DUY NHẤT 1 CHUỖI JSON ĐÚNG ĐỊNH DẠNG SAU, KHÔNG KÈM THEO BẤT KỲ VĂN BẢN NÀO KHÁC BÊN NGOÀI (Không markdown, không bọc \`\`\`json):
{
  "universities": [
    {
      "name": "Tên trường (Ví dụ: Đại học Bách Khoa Hà Nội)",
      "majors": [
        {
          "name": "Tên ngành (Ví dụ: Khoa học Máy tính)",
          "predicted_benchmark": 28.5, // Điểm chuẩn dự kiến (số thập phân)
          "chance": "Rất khó", // Một trong các mức: "An toàn", "Khả năng đỗ cao", "Cạnh tranh", "Khó đỗ", "Rất khó"
          "probability": 15, // Tỷ lệ đỗ (%) từ 0 - 100
          "advice": "Lời khuyên ngắn gọn chi tiết cho lựa chọn này."
        }
      ]
    }
  ],
  "overall_advice": "Lời khuyên tổng quan dành cho học sinh về chiến lược đặt nguyện vọng hoặc nhận xét chung về điểm số và lựa chọn."
}
`;

  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ promptText })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Có lỗi khi kết nối tới Backend');
    }

    const data = await response.json();
    let textResult = data.text;
    
    // Remove markdown code blocks if AI still outputs them despite instructions
    textResult = textResult.replace(/^```json/m, '').replace(/^```/m, '').trim();

    return JSON.parse(textResult) as PredictionResult;
  } catch (error: any) {
    console.error('Error calling Backend API:', error);
    throw new Error(error.message || 'Lỗi xử lý. Vui lòng kiểm tra lại Backend Server.');
  }
};
