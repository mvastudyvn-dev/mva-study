const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Tải biến môi trường
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY && API_KEY !== 'your_api_key_here') {
  genAI = new GoogleGenerativeAI(API_KEY);
}

// 1. API: Tư vấn tuyển sinh
app.post('/api/predict', async (req, res) => {
  if (!genAI) {
    return res.status(500).json({ error: { message: "Server chưa cấu hình API Key" } });
  }

  try {
    const { promptText } = req.body;
    
    const model = genAI.getGenerativeModel(
      { model: "gemini-3.5-flash" },
      { apiVersion: 'v1' }
    );

    const result = await model.generateContent(promptText);
    const textResult = result.response.text();
    
    res.json({ text: textResult });
  } catch (error) {
    console.error('Error in /api/predict:', error);
    res.status(500).json({ error: { message: error.message || "Lỗi xử lý tại Server" } });
  }
});

// 2. API: Trợ lý Chatbot
const SYSTEM_INSTRUCTION = `Bạn là nhân viên tư vấn xuất sắc của trung tâm luyện thi MVA Study. 
Nhiệm vụ của bạn là tư vấn khóa học, giải đáp thắc mắc và hỗ trợ kỹ thuật cho học sinh và phụ huynh một cách nhiệt tình, chuyên nghiệp.
Một số thông tin về trung tâm: 
- Chuyên dạy Toán, Lý, Hóa, Văn, Anh từ lớp 6 đến 12. Đặc biệt là luyện thi Đại học.
- Học phí trung bình: 800.000đ - 1.200.000đ/tháng.
- Địa chỉ: 123 Đường Học Tập, Quận 1, TP.HCM. Cả học offline và online.
- Hotline: 1900 xxxx.
Luôn trả lời ngắn gọn, súc tích (dưới 3-4 câu), thân thiện và thỉnh thoảng dùng emoji. Nếu không biết câu trả lời, hãy khuyên khách hàng để lại số điện thoại hoặc gọi hotline.`;

app.post('/api/chat', async (req, res) => {
  if (!genAI) {
    return res.status(500).json({ error: "Server chưa cấu hình API Key" });
  }

  try {
    const { message, history } = req.body;
    
    const model = genAI.getGenerativeModel(
      { 
        model: "gemini-3.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION 
      },
      { apiVersion: 'v1' }
    );

    const chatSession = model.startChat({
      history: history || []
    });

    const result = await chatSession.sendMessage(message);
    const textResult = result.response.text();

    res.json({ text: textResult });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: error.message || "Lỗi Chat tại Server" });
  }
});

// Xuất ứng dụng để Vercel chạy thay vì app.listen()
module.exports = app;
