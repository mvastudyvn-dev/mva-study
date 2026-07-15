import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

router.get('/cleanup', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ success: false, error: 'Chưa cấu hình Supabase' });
  }

  try {
    console.log('Cron Job: Bắt đầu chạy kịch bản dọn dẹp mã kích hoạt hết hạn...');

    // 1. Lấy danh sách khóa học để biết thời lượng (durationMonths)
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, duration_months');
    
    if (coursesError) throw coursesError;

    // 2. Lấy danh sách mã đã kích hoạt có ngày kích hoạt
    const { data: codes, error: codesError } = await supabase
      .from('activation_codes')
      .select('*')
      .eq('is_used', true)
      .not('activation_date', 'is', null);

    if (codesError) throw codesError;

    const now = new Date();
    const codesToDelete = [];

    // 3. Tính toán mã hết hạn
    for (const code of codes) {
      const course = courses.find((c) => c.id === code.courseId);
      if (course && course.duration_months) {
        // Tạo Date từ chuỗi ISO
        const actDate = new Date(code.activation_date);
        if (isNaN(actDate.getTime())) continue; // Bỏ qua nếu ngày lỗi

        // Cộng thêm số tháng
        actDate.setMonth(actDate.getMonth() + course.duration_months);

        // Nếu ngày hiện tại lớn hơn ngày hết hạn, mã đã hết hạn
        if (now > actDate) {
          codesToDelete.push(code.code);
        }
      }
    }

    console.log(`Cron Job: Tìm thấy ${codesToDelete.length} mã đã hết hạn cần xóa.`);

    // 4. Xóa các mã hết hạn
    let deletedCount = 0;
    if (codesToDelete.length > 0) {
      // Chia nhỏ từng mã để xóa hoặc dùng tính năng in()
      const { error: deleteError } = await supabase
        .from('activation_codes')
        .delete()
        .in('code', codesToDelete);

      if (deleteError) throw deleteError;
      deletedCount = codesToDelete.length;
    }

    return res.status(200).json({ 
      success: true, 
      message: `Đã dọn dẹp ${deletedCount} mã hết hạn.` 
    });

  } catch (error) {
    console.error('Lỗi trong quá trình dọn dẹp:', error);
    return res.status(500).json({ success: false, error: 'Đã xảy ra lỗi khi dọn dẹp' });
  }
});

export default router;
