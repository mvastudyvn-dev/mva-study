import express from 'express';
import PayOS from '@payos/node';
const PayOSClass = PayOS.PayOS || PayOS;
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// 1. Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// 2. Initialize PayOS
let payos = null;
if (process.env.PAYOS_CLIENT_ID && process.env.PAYOS_API_KEY && process.env.PAYOS_CHECKSUM_KEY) {
  payos = new PayOSClass({
    clientId: process.env.PAYOS_CLIENT_ID,
    apiKey: process.env.PAYOS_API_KEY,
    checksumKey: process.env.PAYOS_CHECKSUM_KEY
  });
}

// 3. Initialize Nodemailer
let transporter = null;
if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

// Helper: Lấy Domain hiện tại
const getDomain = (req) => {
  // Ưu tiên origin từ frontend gửi lên, nếu không có thì dùng host hiện tại
  const origin = req.get('origin');
  if (origin) return origin;
  return `${req.protocol}://${req.get('host')}`;
};

// API: Tạo link thanh toán
router.post('/create-payment-link', async (req, res) => {
  if (!payos || !supabase) {
    return res.status(500).json({ error: 'Server chưa được cấu hình biến môi trường đầy đủ (PayOS hoặc Supabase).' });
  }

  try {
    const { userId, courseId, courseName, amount } = req.body;

    if (!userId || !courseId || !amount) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Sinh mã đơn hàng ngẫu nhiên (PayOS yêu cầu number, max 9007199254740991)
    const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 1000));

    // 1. Lưu thông tin đơn hàng vào bảng orders (Supabase)
    const { error: dbError } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        user_id: userId,
        course_id: courseId,
        amount: amount,
        status: 'pending'
      });

    if (dbError) {
      console.error('Lỗi khi lưu đơn hàng:', dbError);
      return res.status(500).json({ error: 'Không thể tạo đơn hàng trong Database' });
    }

    // 2. Gọi PayOS để tạo link thanh toán
    const domain = getDomain(req);
    const body = {
      orderCode: orderCode,
      amount: amount,
      description: `MVA ${courseId}`.substring(0, 25), // PayOS giới hạn 25 ký tự
      returnUrl: `${domain}/payment-result?status=success&orderCode=${orderCode}`,
      cancelUrl: `${domain}/payment-result?status=cancel&orderCode=${orderCode}`
    };

    const paymentLinkRes = await payos.paymentRequests.create(body);

    res.json({ checkoutUrl: paymentLinkRes.checkoutUrl });

  } catch (error) {
    console.error('Lỗi create-payment-link:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo link thanh toán' });
  }
});

// API: Webhook nhận thông báo thanh toán thành công từ PayOS
router.post('/webhook', async (req, res) => {
  if (!payos || !supabase || !transporter) {
    console.error('Lỗi Webhook: Server thiếu biến môi trường.');
    return res.json({ error: 'Thiếu cấu hình biến môi trường' }); // Vẫn trả về 200 để PayOS không báo lỗi 500
  }

  // Nếu đây chỉ là request xác nhận URL của PayOS (thường data webhook xác nhận sẽ khác một chút)
  // PayOS sẽ yêu cầu HTTP status code là 200
  try {
    const verifiedData = await payos.webhooks.verify(req.body);

    if (req.body.code === '00' || req.body.code === '0') { // Đôi khi PayOS dùng '0' hoặc '00'
      const orderCode = verifiedData.orderCode;

      // 1. Lấy thông tin đơn hàng từ database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_code', orderCode)
        .single();

      if (orderError || !order) {
        console.error('Không tìm thấy đơn hàng:', orderCode);
        return res.json({ error: 'Order not found' });
      }

      // Nếu đơn hàng đã xử lý rồi thì bỏ qua
      if (order.status === 'paid') {
        return res.json({ success: true, message: 'Order already processed' });
      }

      // 2. Tìm 1 mã kích hoạt chưa sử dụng cho khóa học này
      const { data: codes, error: codeError } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('course_id', order.course_id)
        .eq('is_used', false)
        .limit(1);

      if (codeError || !codes || codes.length === 0) {
        console.error('Hết mã kích hoạt cho khóa học:', order.course_id);
        // Có thể cập nhật order status = 'needs_manual_code' ở đây
        return res.json({ error: 'Out of activation codes' });
      }

      const activationCode = codes[0];

      // 3. Lấy thông tin User để lấy email
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', order.user_id)
        .single();

      if (userError || !user || !user.email) {
        console.error('Không tìm thấy user email cho đơn hàng:', orderCode);
        return res.json({ error: 'User email not found' });
      }

      // 4. Cập nhật mã đã sử dụng
      await supabase
        .from('activation_codes')
        .update({ is_used: true, used_by_email: user.email, activation_date: new Date().toISOString() })
        .eq('code', activationCode.code);

      // 5. Cập nhật đơn hàng thành công
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('order_code', orderCode);

      // 6. Gửi Email mã kích hoạt
      const mailOptions = {
        from: `"MVA Study" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: 'Mã kích hoạt khóa học MVA Study',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #FF8C2F; text-align: center;">Cảm ơn bạn đã mua khóa học!</h2>
            <p>Chào <strong>${user.name}</strong>,</p>
            <p>Thanh toán của bạn cho khóa học đã thành công. Dưới đây là mã kích hoạt khóa học của bạn:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #1E3A8A; letter-spacing: 2px;">${activationCode.code}</span>
            </div>
            <p><strong>Hướng dẫn kích hoạt:</strong></p>
            <ol>
              <li>Đăng nhập vào tài khoản của bạn trên trang web MVA Study.</li>
              <li>Truy cập vào trang cá nhân (hoặc trang nhập mã).</li>
              <li>Nhập mã kích hoạt phía trên để mở khóa khóa học.</li>
            </ol>
            <p>Chúc bạn học tập hiệu quả!</p>
            <hr style="border-top: 1px solid #e0e0e0; margin-top: 30px;">
            <p style="font-size: 12px; color: #888; text-align: center;">Đây là email tự động, vui lòng không trả lời.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Đã gửi email mã kích hoạt tới:', user.email);

      res.json({ success: true });
    } else {
      res.json({ error: 'Webhook fail' });
    }
  } catch (error) {
    console.error('Lỗi webhook:', error);
    res.json({ error: 'Webhook error' });
  }
});

export default router;
