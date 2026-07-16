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

      // 0. Kiểm tra xem orderCode này thuộc về tuition_invoices (Học phí) hay orders (Khóa học)
      const { data: tuition, error: tuitionError } = await supabase
        .from('tuition_invoices')
        .select('*')
        .eq('order_code', orderCode)
        .single();

      if (tuition && !tuitionError) {
        // Đơn này là đơn học phí
        if (tuition.status === 'paid') {
          return res.json({ success: true, message: 'Tuition already paid' });
        }

        // Cập nhật trạng thái
        await supabase
          .from('tuition_invoices')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('order_code', orderCode);

        // Lấy thông tin User để gửi email
        const { data: user } = await supabase
          .from('users')
          .select('email, name')
          .eq('id', tuition.user_id)
          .single();

        if (user && user.email) {
          const mailOptions = {
            from: `"MVA Study" <${process.env.GMAIL_USER}>`,
            to: user.email,
            subject: 'Xác nhận thanh toán học phí thành công - MVA Study',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #FF8C2F; text-align: center;">Thanh toán thành công!</h2>
                <p>Chào <strong>${user.name}</strong>,</p>
                <p>Hệ thống MVA Study đã ghi nhận thanh toán thành công cho hóa đơn học phí của bạn.</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>Nội dung:</strong> ${tuition.description}</p>
                  <p><strong>Số tiền:</strong> ${tuition.amount.toLocaleString()} VNĐ</p>
                </div>
                <p>Cảm ơn bạn đã luôn đồng hành cùng MVA Study. Chúc bạn học tập hiệu quả!</p>
                <hr style="border-top: 1px solid #e0e0e0; margin-top: 30px;">
                <p style="font-size: 12px; color: #888; text-align: center;">Đây là email tự động, vui lòng không trả lời.</p>
              </div>
            `
          };
          await transporter.sendMail(mailOptions);
        }
        return res.json({ success: true, message: 'Tuition paid successfully' });
      }

      // 1. Lấy thông tin đơn hàng từ database (Đơn mua khóa học)
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
        .is('used_by_email', null) // Đảm bảo chưa có ai sở hữu mã này
        .limit(1);

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

      if (codeError || !codes || codes.length === 0) {
        console.error('Hết mã kích hoạt cho khóa học:', order.course_id);
        
        // Cập nhật đơn hàng thành công nhưng thiếu mã
        await supabase
          .from('orders')
          .update({ status: 'needs_manual_code' })
          .eq('order_code', orderCode);

        // Gửi email báo hết mã
        const outOfCodeMailOptions = {
          from: `"MVA Study" <${process.env.GMAIL_USER}>`,
          to: user.email,
          subject: 'Xác nhận thanh toán thành công khóa học MVA Study',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #FF8C2F; text-align: center;">Thanh toán thành công!</h2>
              <p>Chào <strong>${user.name}</strong>,</p>
              <p>Hệ thống đã ghi nhận thanh toán của bạn cho khóa học thành công.</p>
              <p>Hiện tại, kho mã tự động của hệ thống đang tạm hết. Bạn đừng lo lắng nhé! Quản trị viên của chúng tôi đã nhận được thông báo và sẽ <strong>gửi mã kích hoạt thủ công cho bạn qua Email này trong thời gian sớm nhất (tối đa 24h)</strong>.</p>
              <p>Cảm ơn bạn đã đồng hành cùng MVA Study!</p>
            </div>
          `
        };
        await transporter.sendMail(outOfCodeMailOptions);

        return res.json({ success: true, message: 'Out of activation codes, manual email sent' });
      }

      const activationCode = codes[0];

      // Đoạn code phía trên đã xử lý kiểm tra User Email.

      // 4. Cập nhật mã (Gán email người mua)
      // KHÔNG CẬP NHẬT status: 'Đã bán' VÌ SẼ VI PHẠM CHECK CONSTRAINT CỦA SUPABASE ('Chưa sử dụng' hoặc 'Đã sử dụng')
      await supabase
        .from('activation_codes')
        .update({ used_by_email: user.email })
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

// API: Cấp mã bù thủ công cho đơn hàng bị thiếu mã
router.post('/issue-code', async (req, res) => {
  if (!supabase || !transporter) {
    return res.status(500).json({ error: 'Server chưa cấu hình Supabase hoặc Email' });
  }

  try {
    const { orderCode } = req.body;
    if (!orderCode) {
      return res.status(400).json({ error: 'Thiếu orderCode' });
    }

    // 1. Lấy thông tin đơn hàng
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_code', orderCode)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    if (order.status !== 'needs_manual_code') {
      return res.status(400).json({ error: 'Đơn hàng không ở trạng thái cần cấp mã bù' });
    }

    // 2. Lấy thông tin User
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', order.user_id)
      .single();

    if (userError || !user || !user.email) {
      return res.status(404).json({ error: 'Không tìm thấy email học sinh' });
    }

    // 3. Tìm mã chưa bán
    const { data: codes, error: codeError } = await supabase
      .from('activation_codes')
      .select('*')
      .eq('course_id', order.course_id)
      .eq('is_used', false)
      .is('used_by_email', null)
      .limit(1);

    if (codeError || !codes || codes.length === 0) {
      return res.status(400).json({ error: 'Vẫn chưa có mã kích hoạt mới trong kho. Vui lòng tạo thêm mã!' });
    }

    const activationCode = codes[0];

    // 4. Cập nhật mã (Gán email)
    // Giữ nguyên status vì DB check constraint
    await supabase
      .from('activation_codes')
      .update({ used_by_email: user.email })
      .eq('code', activationCode.code);

    // 5. Cập nhật đơn hàng thành paid
    await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('order_code', orderCode);

    // 6. Gửi email
    const mailOptions = {
      from: `"MVA Study" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: 'Mã kích hoạt khóa học MVA Study (Cấp bù)',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #FF8C2F; text-align: center;">Cảm ơn bạn đã kiên nhẫn chờ đợi!</h2>
          <p>Chào <strong>${user.name}</strong>,</p>
          <p>Quản trị viên đã cấp mã kích hoạt khóa học cho giao dịch của bạn. Dưới đây là mã kích hoạt của bạn:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #1E3A8A; letter-spacing: 2px;">${activationCode.code}</span>
          </div>
          <p><strong>Hướng dẫn kích hoạt:</strong></p>
          <ol>
            <li>Đăng nhập vào tài khoản của bạn trên trang web MVA Study.</li>
            <li>Truy cập vào trang cá nhân (hoặc bấm vào hình dấu cộng "Kích hoạt khóa học").</li>
            <li>Nhập mã kích hoạt phía trên để mở khóa khóa học.</li>
          </ol>
          <p>Chúc bạn học tập hiệu quả!</p>
          <hr style="border-top: 1px solid #e0e0e0; margin-top: 30px;">
          <p style="font-size: 12px; color: #888; text-align: center;">Đây là email tự động, vui lòng không trả lời.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Đã cấp mã và gửi email thành công' });
  } catch (error) {
    console.error('Lỗi khi cấp mã bù:', error);
    res.status(500).json({ error: 'Lỗi hệ thống khi cấp mã' });
  }
});

// API: Admin tạo hóa đơn học phí (Tuition Invoice)
router.post('/create-tuition-invoice', async (req, res) => {
  if (!supabase || !transporter) {
    return res.status(500).json({ error: 'Server chưa cấu hình Supabase hoặc Email' });
  }

  try {
    const { userIds, amount, description } = req.body;
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !amount || !description) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Lấy thông tin users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name')
      .in('id', userIds);

    if (usersError || !users) {
      return res.status(400).json({ error: 'Không tìm thấy thông tin học sinh' });
    }

    const invoicesToInsert = users.map(user => ({
      user_id: user.id,
      amount: amount,
      description: description,
      status: 'pending'
    }));

    const { error: insertError } = await supabase
      .from('tuition_invoices')
      .insert(invoicesToInsert);

    if (insertError) {
      console.error('Lỗi khi tạo hóa đơn:', insertError);
      return res.status(500).json({ error: 'Không thể tạo hóa đơn trong Database' });
    }

    // Gửi email nhắc nhở cho từng học sinh
    for (const user of users) {
      if (user.email) {
        const mailOptions = {
          from: `"MVA Study" <${process.env.GMAIL_USER}>`,
          to: user.email,
          subject: 'Thông báo thanh toán học phí - MVA Study',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #FF8C2F; text-align: center;">Thông báo học phí</h2>
              <p>Chào <strong>${user.name}</strong>,</p>
              <p>Bạn có một hóa đơn học phí mới trên hệ thống MVA Study cần được thanh toán.</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Nội dung:</strong> ${description}</p>
                <p><strong>Số tiền cần thanh toán:</strong> ${amount.toLocaleString()} VNĐ</p>
              </div>
              <p>Vui lòng đăng nhập vào tài khoản của bạn trên trang web MVA Study, truy cập mục <strong>Học phí</strong> để tiến hành thanh toán.</p>
              <p>Cảm ơn bạn!</p>
              <hr style="border-top: 1px solid #e0e0e0; margin-top: 30px;">
              <p style="font-size: 12px; color: #888; text-align: center;">Đây là email tự động, vui lòng không trả lời.</p>
            </div>
          `
        };
        await transporter.sendMail(mailOptions).catch(e => console.error('Lỗi gửi email cho', user.email, e));
      }
    }

    res.json({ success: true, message: 'Đã tạo hóa đơn và gửi email thành công' });
  } catch (error) {
    console.error('Lỗi create-tuition-invoice:', error);
    res.status(500).json({ error: 'Lỗi hệ thống khi tạo hóa đơn' });
  }
});

// API: Lấy danh sách hóa đơn học phí của Admin
router.get('/tuition', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not connected' });
  try {
    const { data, error } = await supabase
      .from('tuition_invoices')
      .select('*, users!inner(name, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data
    const formattedData = data.map(item => ({
      id: item.id,
      userId: item.user_id,
      userName: item.users?.name,
      userEmail: item.users?.email,
      amount: item.amount,
      description: item.description,
      status: item.status,
      orderCode: item.order_code,
      createdAt: item.created_at,
      paidAt: item.paid_at
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách học phí' });
  }
});

// API: Lấy danh sách hóa đơn học phí của 1 Học sinh
router.get('/tuition/:userId', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Database not connected' });
  try {
    const { data, error } = await supabase
      .from('tuition_invoices')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách học phí' });
  }
});

// API: Học sinh tạo link thanh toán PayOS cho 1 hóa đơn
router.post('/create-tuition-payment-link', async (req, res) => {
  if (!payos || !supabase) return res.status(500).json({ error: 'Chưa cấu hình API' });

  try {
    const { invoiceId } = req.body;
    if (!invoiceId) return res.status(400).json({ error: 'Thiếu mã hóa đơn' });

    // 1. Lấy thông tin hóa đơn
    const { data: invoice, error: invoiceError } = await supabase
      .from('tuition_invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return res.status(404).json({ error: 'Không tìm thấy hóa đơn' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ error: 'Hóa đơn này đã được thanh toán' });
    }

    // 2. Tạo Order Code mới cho PayOS
    const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 1000));

    // Cập nhật order_code vào hóa đơn
    await supabase
      .from('tuition_invoices')
      .update({ order_code: orderCode })
      .eq('id', invoiceId);

    // 3. Gọi PayOS
    const domain = getDomain(req);
    const body = {
      orderCode: orderCode,
      amount: invoice.amount,
      description: `Hoc phi MVA`.substring(0, 25), // PayOS giới hạn 25 ký tự
      returnUrl: `${domain}/student?tab=tuition`,
      cancelUrl: `${domain}/student?tab=tuition`
    };

    const paymentLinkRes = await payos.paymentRequests.create(body);

    res.json({ checkoutUrl: paymentLinkRes.checkoutUrl });
  } catch (error) {
    console.error('Lỗi create-tuition-payment-link:', error);
    res.status(500).json({ error: 'Lỗi khi tạo link thanh toán học phí' });
  }
});

export default router;
