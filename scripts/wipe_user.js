import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Không tìm thấy biến môi trường Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function wipeUser(username) {
  console.log(`Bắt đầu xóa dữ liệu của tài khoản: ${username}`);

  // 1. Lấy thông tin user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email')
    .eq('username', username)
    .single();

  if (userError || !user) {
    console.error('Không tìm thấy tài khoản này!');
    return;
  }

  const userId = user.id;
  const userEmail = user.email;
  console.log(`Đã tìm thấy: ID = ${userId}, Email = ${userEmail}`);

  // 2. Xóa đơn hàng (orders)
  console.log('Đang xóa lịch sử đơn hàng...');
  const { error: orderError } = await supabase
    .from('orders')
    .delete()
    .eq('user_id', userId);
  if (orderError) console.error('Lỗi khi xóa orders:', orderError);

  // 3. Xóa tiến trình học (user_progress)
  console.log('Đang xóa lịch sử tiến trình học...');
  const { error: progError } = await supabase
    .from('user_progress')
    .delete()
    .eq('user_id', userId);
  if (progError) console.error('Lỗi khi xóa user_progress:', progError);

  // 4. Thu hồi mã kích hoạt (activation_codes)
  console.log('Đang thu hồi và reset lại các mã kích hoạt đã cấp...');
  const { error: codeError } = await supabase
    .from('activation_codes')
    .update({ 
      status: 'Chưa sử dụng', 
      is_used: false, 
      used_by_email: null, 
      activation_date: null 
    })
    .eq('used_by_email', userEmail);
  if (codeError) console.error('Lỗi khi thu hồi mã:', codeError);

  console.log('✅ Hoàn tất dọn dẹp trắng dữ liệu cho tài khoản:', username);
}

const targetUsername = process.argv[2];
if (!targetUsername) {
  console.log('Vui lòng truyền vào username. Ví dụ: node scripts/wipe_user.js tminh_mva');
  process.exit(1);
}

wipeUser(targetUsername);
