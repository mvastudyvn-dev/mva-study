import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Tải biến môi trường
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Lấy các API Key từ biến môi trường (Ưu tiên Key riêng, nếu không có thì dùng Key chung)
const CHAT_API_KEY = process.env.GEMINI_API_KEY_CHAT || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const PREDICT_API_KEY = process.env.GEMINI_API_KEY_PREDICT || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

let chatGenAI = null;
if (CHAT_API_KEY && CHAT_API_KEY !== 'your_api_key_here') {
  chatGenAI = new GoogleGenerativeAI(CHAT_API_KEY);
}

let predictGenAI = null;
if (PREDICT_API_KEY && PREDICT_API_KEY !== 'your_api_key_here') {
  predictGenAI = new GoogleGenerativeAI(PREDICT_API_KEY);
}

// 1. API: Tư vấn tuyển sinh
app.post('/api/predict', async (req, res) => {
  if (!predictGenAI) {
    return res.status(500).json({ error: { message: "Server chưa cấu hình API Key cho tính năng Tra Cứu" } });
  }

  try {
    const { promptText } = req.body;
    
    let textResult = "";
    let attempt = 0;
    while (attempt < 3) {
      try {
        const predictSystemInstruction = "Bạn là hệ thống tự động xuất dữ liệu JSON. TUYỆT ĐỐI TUÂN THỦ: Chỉ trả về định dạng JSON cực kỳ ngắn gọn, không giải thích dài dòng. Mỗi yêu cầu trả về KHÔNG QUÁ 3 trường, mỗi trường TỐI ĐA 2 ngành. Không xuất bất kỳ văn bản nào ngoài JSON.\n\n";
        const model = predictGenAI.getGenerativeModel({ 
          model: "gemini-3.5-flash"
        }, { apiVersion: 'v1' });
        const result = await model.generateContent(predictSystemInstruction + promptText);
        textResult = result.response.text();
        break; // Thành công
      } catch (e) {
        attempt++;
        if (e.message.includes("503") && attempt < 3) {
          console.warn(`gemini-3.5-flash overloaded. Retrying attempt ${attempt}...`);
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Đợi 2s, 4s
        } else {
          throw e;
        }
      }
    }
    
    res.json({ text: textResult });
  } catch (error) {
    console.error('Error in /api/predict:', error);
    res.status(500).json({ error: { message: error.message || "Lỗi xử lý tại Server" } });
  }
});

const SYSTEM_INSTRUCTION = `Bạn là nhân viên tư vấn xuất sắc của MVA Study - Trung tâm đào tạo tin học hàng đầu.
Nhiệm vụ của bạn là tư vấn các khóa học tin học, giải đáp thắc mắc và hỗ trợ kỹ thuật cho học viên một cách nhiệt tình, chuyên nghiệp.
Một số thông tin về trung tâm: 
- Chuyên giảng dạy và luyện thi chứng chỉ tin học quốc tế: MOS (Word, Excel, PowerPoint), IC3 (GS6).
- Đặc biệt có khóa Luyện thi THPT Quốc Gia môn Tin học.
- Có các khóa học lẻ và Combo tiết kiệm (MOS + IC3).
- Phương pháp dạy: Học đi đôi với hành, cam kết chuẩn đầu ra.
- Hotline hỗ trợ: 1900 xxxx.
Luôn trả lời cực kỳ ngắn gọn (TỐI ĐA 50 TỪ), thân thiện và thỉnh thoảng dùng emoji. Rất quan trọng: Không bao giờ trả lời quá dài. Nếu không biết câu trả lời, hãy khuyên khách hàng để lại thông tin.`;

app.post('/api/chat', async (req, res) => {
  if (!chatGenAI) {
    return res.status(500).json({ error: "Server chưa cấu hình API Key cho Chatbot" });
  }

  try {
    const { message, history } = req.body;
    
    let textResult = "";
    let attempt = 0;
    while (attempt < 3) {
      try {
        const model = chatGenAI.getGenerativeModel({ 
          model: "gemini-3.5-flash"
        }, { apiVersion: 'v1' });
        const chatSession = model.startChat({ history: history || [] });
        
        // V1 không hỗ trợ systemInstruction trong config, nên ta chèn thẳng vào tin nhắn
        const finalMessage = "HƯỚNG DẪN HỆ THỐNG:\n" + SYSTEM_INSTRUCTION + "\n\nLỜI KHÁCH HÀNG:\n" + message;
        const result = await chatSession.sendMessage(finalMessage);
        
        textResult = result.response.text();
        break; // Thành công thì thoát vòng lặp
      } catch (e) {
        attempt++;
        if (e.message.includes("503") && attempt < 3) {
          console.warn(`gemini-3.5-flash overloaded in chat. Retrying attempt ${attempt}...`);
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Đợi 2s, 4s
        } else {
          throw e; // Báo lỗi ra ngoài nếu không phải 503 hoặc hết số lần thử
        }
      }
    }

    res.json({ text: textResult });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: error.message || "Lỗi Chat tại Server" });
  }
});

// Mount payment API
import paymentRouter from './payment.js';
app.use('/api/payment', paymentRouter);

// Xuất ứng dụng để Vercel chạy thay vì app.listen()
export default app;
