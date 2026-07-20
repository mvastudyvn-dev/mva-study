import { supabase } from './supabase';

export interface ExamAttempt {
  attemptNumber: number;
  score: number;
  submittedAt: string;
  wrongAnswers?: string[];
  userId?: string; // Bổ sung để hiển thị ở admin
}

const LOCAL_KEY = 'mva_exam_history';

// ── Helpers localStorage (fallback) ────────────────────────────
function getLocalHistory(userId: string, examId: string): ExamAttempt[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, Record<string, ExamAttempt[]>>;
    return all[userId]?.[examId] || [];
  } catch {
    return [];
  }
}

function saveLocalAttempt(userId: string, examId: string, score: number, wrongAnswers?: string[]) {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const all: Record<string, Record<string, ExamAttempt[]>> = raw ? JSON.parse(raw) : {};
    if (!all[userId]) all[userId] = {};
    if (!all[userId][examId]) all[userId][examId] = [];
    const attempts = all[userId][examId];
    const newAttempt: ExamAttempt = {
      attemptNumber: attempts.length + 1,
      score,
      submittedAt: new Date().toISOString(),
      wrongAnswers,
    };
    all[userId][examId] = [...attempts, newAttempt];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

// ── Supabase functions ──────────────────────────────────────────

/**
 * Lấy lịch sử làm bài của một học sinh cụ thể (Dành cho Student)
 */
export async function getExamHistory(userId: string, examId: string): Promise<ExamAttempt[]> {
  try {
    const { data, error } = await supabase
      .from('exam_attempts')
      .select('attempt_number, score, submitted_at, wrong_answers')
      .eq('user_id', userId)
      .eq('exam_id', examId)
      .order('submitted_at', { ascending: true });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      attemptNumber: row.attempt_number,
      score: Number(row.score),
      submittedAt: row.submitted_at,
      wrongAnswers: row.wrong_answers,
    }));
  } catch (e) {
    console.warn('Fallback to localStorage for exam history', e);
    return getLocalHistory(userId, examId);
  }
}

/**
 * Lấy tất cả lượt làm bài của một đề thi (Dành cho Admin Analytics)
 */
export async function getAllAttemptsByExamId(examId: string): Promise<ExamAttempt[]> {
  try {
    const { data, error } = await supabase
      .from('exam_attempts')
      .select('user_id, attempt_number, score, submitted_at, wrong_answers')
      .eq('exam_id', examId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      userId: row.user_id,
      attemptNumber: row.attempt_number,
      score: Number(row.score),
      submittedAt: row.submitted_at,
      wrongAnswers: row.wrong_answers,
    }));
  } catch (e) {
    console.error('Failed to get all attempts for exam:', e);
    
    // Fallback to local storage (admin might not see other users' local storage, but good for local dev)
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return [];
      const all = JSON.parse(raw) as Record<string, Record<string, ExamAttempt[]>>;
      let allAttempts: ExamAttempt[] = [];
      Object.keys(all).forEach(userId => {
        if (all[userId][examId]) {
          const userAttempts = all[userId][examId].map(a => ({ ...a, userId }));
          allAttempts = allAttempts.concat(userAttempts);
        }
      });
      return allAttempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    } catch {
      return [];
    }
  }
}

/**
 * Lưu lần làm bài lên Supabase, đồng thời cũng lưu localStorage làm cache.
 */
export async function saveExamAttempt(userId: string, examId: string, score: number, wrongAnswers?: string[]): Promise<void> {
  // Luôn lưu localStorage trước (cache + offline support)
  saveLocalAttempt(userId, examId, score, wrongAnswers);

  try {
    // Lấy số lần thi hiện tại để tính attempt_number
    const { count } = await supabase
      .from('exam_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('exam_id', examId);

    const attemptNumber = (count ?? 0) + 1;

    const { error } = await supabase.from('exam_attempts').insert({
      user_id: userId,
      exam_id: examId,
      score: Math.round(score * 100) / 100,
      attempt_number: attemptNumber,
      submitted_at: new Date().toISOString(),
      wrong_answers: wrongAnswers,
    });

    if (error) throw error;
  } catch (e) {
    console.warn('Failed to save exam attempt to Supabase, kept in localStorage', e);
  }
}
