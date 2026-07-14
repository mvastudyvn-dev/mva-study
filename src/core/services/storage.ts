import type {
  Course, ActivationCode, ConsultationForm,
  Teacher, NewsItem, LeaderboardEntry, NotificationItem,
  TopStudent, MonthlyStudentData, Lesson, Exam
} from '../types/global';

export const STORAGE_KEYS = {
  SESSION: 'mva_session',
  USERS: 'mva_users',
  COURSES: 'mva_courses',
  LESSONS: 'mva_lessons',
  EXAMS: 'mva_exams',
  CODES: 'mva_activation_codes',
  CONSULTATIONS: 'mva_consultations',
  TEACHERS: 'mva_teachers',
  NEWS: 'mva_news',
  LEADERBOARD: 'mva_leaderboard',
  NOTIFICATIONS: 'mva_notifications',
  TOP_STUDENTS: 'mva_top_students',
  MONTHLY_STATS: 'mva_monthly_stats',
  SYSTEM_SETTINGS: 'mva_system_settings',
  USER_PROGRESS: 'mva_user_progress_v3',
  DOCUMENTS: 'mva_documents',
};

import { mockCourses, mockTeachers, mockNews, mockLeaderboard } from '../../features/landing/constants/mockData';
import { mockCodes } from '../../features/admin/constants/mockData';
import { mockNotifications, mockTopStudents, mockMonthlyStats } from '../../features/student/constants/mockData';
import { supabase } from './supabase';


export const StorageService = {
  initializeMockData() {
    // Mock data initialization has been disabled so the web stays empty for new design
  },

  // Session
  getSession(): any { const s = localStorage.getItem(STORAGE_KEYS.SESSION); return s ? JSON.parse(s) : null; },
  saveSession(user: any) { localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user)); },
  clearSession() { localStorage.removeItem(STORAGE_KEYS.SESSION); },

  // Users - Fetch from Supabase
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Error fetching users from Supabase:', error);
        // Fallback to localStorage if Supabase is not ready yet
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      }
      
      // Transform snake_case from DB back to camelCase for the app
      return data.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
        enrolledCourses: u.enrolled_courses,
        points: u.points,
        totalTime: u.total_time,
        completedCoursesCount: u.completed_courses_count,
        class: u.class_name,
        dob: u.dob,
        school: u.school,
        province: u.province,
        status: u.status,
        joinDate: u.join_date
      })) as User[];
    } catch (e) {
      console.error(e);
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    }
  },
  
  async updateUser(updatedUser: User) {
    try {
      // Prepare data for Supabase (camelCase to snake_case)
      const dataToUpdate = {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        enrolled_courses: updatedUser.enrolledCourses,
        points: updatedUser.points,
        total_time: updatedUser.totalTime,
        completed_courses_count: updatedUser.completedCoursesCount,
        class_name: updatedUser.class,
        dob: updatedUser.dob,
        school: updatedUser.school,
        province: updatedUser.province,
        status: updatedUser.status,
        join_date: updatedUser.joinDate
      };
      
      const { error } = await supabase
        .from('users')
        .update(dataToUpdate)
        .eq('id', updatedUser.id);
        
      if (error) {
        console.error('Error updating user in Supabase:', error);
      }
      
      // Keep localStorage in sync for now during migration
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const index = users.findIndex((u: User) => u.id === updatedUser.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
    } catch (e) {
      console.error(e);
    }
  },

  async registerUser(userData: any) {
    const id = `s${Date.now()}`;
    const newUser = {
      id,
      name: userData.name,
      email: userData.email,
      username: userData.username,
      phone: userData.phone,
      school: userData.school,
      password: userData.password,
      role: 'student',
      status: 'active',
      join_date: new Date().toLocaleDateString('vi-VN')
    };

    try {
      const { error } = await supabase.from('users').insert(newUser);
      if (error) throw error;
      return { success: true, user: newUser };
    } catch (e: any) {
      console.error(e);
      if (e.code === '23505') { // Unique constraint violation
        if (e.message.includes('email')) return { success: false, error: 'Email này đã được sử dụng.' };
        if (e.message.includes('username')) return { success: false, error: 'Tên đăng nhập này đã tồn tại.' };
      }
      return { success: false, error: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.' };
    }
  },

  // Courses
  async getCourses(): Promise<Course[]> {
    try {
      const { data, error } = await supabase.from('courses').select('*');
      if (error) throw error;
      return data.map((c: any) => ({
        id: c.id,
        title: c.title,
        shortTitle: c.short_title,
        description: c.description,
        icon: c.icon,
        rating: c.rating,
        ratingCount: c.rating_count,
        price: c.price,
        colorCode: c.color_code,
        bgGradient: c.bg_gradient,
        durationMonths: c.duration_months,
      })) as Course[];
    } catch (e) {
      console.warn('Fallback to LocalStorage for Courses');
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
    }
  },
  async saveCourse(course: Course) {
    try {
      const dataToSave = {
        id: course.id,
        title: course.title,
        short_title: course.shortTitle,
        description: course.description,
        icon: course.icon,
        rating: course.rating,
        rating_count: course.ratingCount,
        price: course.price,
        color_code: course.colorCode,
        bg_gradient: course.bgGradient,
        duration_months: course.durationMonths,
      };
      await supabase.from('courses').insert(dataToSave);
    } catch (e) {
      console.error(e);
    }
    // Keep local sync
    const courses = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
    courses.push(course);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },
  async updateCourse(updatedCourse: Course) {
    try {
      const dataToUpdate = {
        title: updatedCourse.title,
        short_title: updatedCourse.shortTitle,
        description: updatedCourse.description,
        icon: updatedCourse.icon,
        rating: updatedCourse.rating,
        rating_count: updatedCourse.ratingCount,
        price: updatedCourse.price,
        color_code: updatedCourse.colorCode,
        bg_gradient: updatedCourse.bgGradient,
        duration_months: updatedCourse.durationMonths,
      };
      await supabase.from('courses').update(dataToUpdate).eq('id', updatedCourse.id);
    } catch (e) {
      console.error(e);
    }
    const courses = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
    const index = courses.findIndex((c: Course) => c.id === updatedCourse.id);
    if (index !== -1) {
      courses[index] = updatedCourse;
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    }
  },
  async deleteCourse(courseId: string) {
    try {
      await supabase.from('courses').delete().eq('id', courseId);
    } catch (e) {
      console.error(e);
    }
    const courses = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
    const newCourses = courses.filter((c: Course) => c.id !== courseId);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(newCourses));
  },

  // Lessons
  async getLessons(): Promise<Lesson[]> {
    try {
      const { data, error } = await supabase.from('lessons').select('*');
      if (error) throw error;
      return data.map((l: any) => ({
        id: l.id,
        courseId: l.course_id,
        title: l.title,
        duration: l.duration,
        videoUrl: l.video_url,
        order: l.order,
      })) as Lesson[];
    } catch (e) {
      console.warn('Fallback to LocalStorage for Lessons');
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSONS) || '[]');
    }
  },
  async saveLesson(lesson: Lesson) {
    try {
      await supabase.from('lessons').insert({
        id: lesson.id,
        course_id: lesson.courseId,
        title: lesson.title,
        duration: lesson.duration,
        video_url: lesson.videoUrl,
        order: lesson.order,
      });
    } catch (e) {
      console.error(e);
    }
    const lessons = JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSONS) || '[]');
    lessons.push(lesson);
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
  },
  async updateLesson(updatedLesson: Lesson) {
    try {
      await supabase.from('lessons').update({
        course_id: updatedLesson.courseId,
        title: updatedLesson.title,
        duration: updatedLesson.duration,
        video_url: updatedLesson.videoUrl,
        order: updatedLesson.order,
      }).eq('id', updatedLesson.id);
    } catch (e) {
      console.error(e);
    }
    const lessons = JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSONS) || '[]');
    const index = lessons.findIndex((l: Lesson) => l.id === updatedLesson.id);
    if (index !== -1) {
      lessons[index] = updatedLesson;
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
    }
  },
  async deleteLesson(lessonId: string) {
    try {
      await supabase.from('lessons').delete().eq('id', lessonId);
    } catch (e) {
      console.error(e);
    }
    const lessons = JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSONS) || '[]');
    const newLessons = lessons.filter((l: Lesson) => l.id !== lessonId);
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(newLessons));
  },

  // Exams
  async getExams(): Promise<Exam[]> {
    try {
      const { data, error } = await supabase.from('exams').select('*');
      if (error) throw error;
      return data.map((e: any) => ({
        id: e.id,
        courseId: e.course_id,
        title: e.title,
        timeLimit: e.time_limit,
        format: e.format,
        fileUrl: e.file_url,
        answerKey: e.answer_key,
      })) as Exam[];
    } catch (e) {
      console.warn('Fallback to LocalStorage for Exams');
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXAMS) || '[]');
    }
  },
  async saveExam(exam: Exam) {
    try {
      await supabase.from('exams').insert({
        id: exam.id,
        course_id: exam.courseId,
        title: exam.title,
        time_limit: exam.timeLimit,
        format: exam.format,
        file_url: exam.fileUrl,
        answer_key: exam.answerKey,
      });
    } catch (e) {
      console.error(e);
    }
    const exams = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXAMS) || '[]');
    exams.push(exam);
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  },
  async updateExam(updatedExam: Exam) {
    try {
      await supabase.from('exams').update({
        course_id: updatedExam.courseId,
        title: updatedExam.title,
        time_limit: updatedExam.timeLimit,
        format: updatedExam.format,
        file_url: updatedExam.fileUrl,
        answer_key: updatedExam.answerKey,
      }).eq('id', updatedExam.id);
    } catch (e) {
      console.error(e);
    }
    const exams = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXAMS) || '[]');
    const index = exams.findIndex((e: Exam) => e.id === updatedExam.id);
    if (index !== -1) {
      exams[index] = updatedExam;
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    }
  },
  async deleteExam(examId: string) {
    try {
      await supabase.from('exams').delete().eq('id', examId);
    } catch (e) {
      console.error(e);
    }
    const exams = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXAMS) || '[]');
    const newExams = exams.filter((e: Exam) => e.id !== examId);
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(newExams));
  },

  // Activation Codes
  async getActivationCodes(): Promise<ActivationCode[]> {
    try {
      const { data, error } = await supabase.from('activation_codes').select('*');
      if (error) throw error;
      return data.map((c: any) => ({
        code: c.code,
        courseId: c.course_id,
        courseName: c.course_name,
        status: c.status,
        isUsed: c.is_used,
        usedByEmail: c.used_by_email,
        activationDate: c.activation_date,
      })) as ActivationCode[];
    } catch (e) {
      console.warn('Fallback to LocalStorage for Activation Codes');
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CODES) || '[]');
    }
  },
  async saveActivationCode(code: ActivationCode) {
    try {
      await supabase.from('activation_codes').insert({
        code: code.code,
        course_id: code.courseId,
        course_name: code.courseName,
        status: code.status,
        is_used: code.isUsed,
        used_by_email: code.usedByEmail,
        activation_date: code.activationDate,
      });
    } catch (e) { console.error(e); }
    const c = JSON.parse(localStorage.getItem(STORAGE_KEYS.CODES) || '[]');
    c.push(code);
    localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(c));
  },
  async updateActivationCode(upd: ActivationCode) {
    try {
      await supabase.from('activation_codes').update({
        course_id: upd.courseId,
        course_name: upd.courseName,
        status: upd.status,
        is_used: upd.isUsed,
        used_by_email: upd.usedByEmail,
        activation_date: upd.activationDate,
      }).eq('code', upd.code);
    } catch (e) { console.error(e); }
    const c = JSON.parse(localStorage.getItem(STORAGE_KEYS.CODES) || '[]');
    const i = c.findIndex((x: ActivationCode) => x.code === upd.code);
    if (i !== -1) { c[i] = upd; localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(c)); }
  },
  async deleteActivationCode(codeString: string) {
    try {
      await supabase.from('activation_codes').delete().eq('code', codeString);
    } catch (e) { console.error(e); }
    const c = JSON.parse(localStorage.getItem(STORAGE_KEYS.CODES) || '[]');
    const newC = c.filter((x: ActivationCode) => x.code !== codeString);
    localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(newC));
  },

  // Consultations
  getConsultations(): ConsultationForm[] { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONSULTATIONS) || '[]'); },
  saveConsultation(form: ConsultationForm) {
    const d = this.getConsultations();
    d.push(form);
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(d));
  },

  // Teachers
  getTeachers(): Teacher[] { return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHERS) || '[]'); },

  // News
  getNews(): NewsItem[] { return JSON.parse(localStorage.getItem(STORAGE_KEYS.NEWS) || '[]'); },

  // Leaderboard
  getLeaderboard(): LeaderboardEntry[] { return JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADERBOARD) || '[]'); },

  // Notifications
  getNotifications(): NotificationItem[] { return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'); },

  // Top Students
  getTopStudents(): TopStudent[] { return JSON.parse(localStorage.getItem(STORAGE_KEYS.TOP_STUDENTS) || '[]'); },

  // Monthly Stats
  getMonthlyStats(): MonthlyStudentData[] { return JSON.parse(localStorage.getItem(STORAGE_KEYS.MONTHLY_STATS) || '[]'); },

  // System Settings
  async getSystemSettings(): Promise<any> {
    try {
      const { data, error } = await supabase.from('system_settings').select('*').eq('id', 'default').single();
      if (error) throw error;
      
      const localSettingsStr = localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS);
      const localSettings = localSettingsStr ? JSON.parse(localSettingsStr) : {};

      return {
        contactName: data.contact_name ?? localSettings.contactName ?? '',
        contactPhone: data.contact_phone ?? localSettings.contactPhone ?? '',
        contactEmail: data.contact_email ?? localSettings.contactEmail ?? '',
        passMark: data.pass_mark ?? localSettings.passMark ?? 5,
        aiAnalysisEnabled: data.ai_analysis_enabled ?? localSettings.aiAnalysisEnabled ?? true,
        popupEnabled: data.popup_enabled ?? localSettings.popupEnabled ?? false,
        popupTitle: data.popup_title ?? localSettings.popupTitle ?? '',
        popupContent: data.popup_content ?? localSettings.popupContent ?? '',
        countdownEnabled: data.countdown_enabled ?? localSettings.countdownEnabled ?? false,
        countdownTargetDate: data.countdown_target_date ?? localSettings.countdownTargetDate ?? '',
        countdownTitle: data.countdown_title ?? localSettings.countdownTitle ?? '',
        countdownSubtitle: data.countdown_subtitle ?? localSettings.countdownSubtitle ?? '',
      };
    } catch (_e) {
      console.warn('Fallback to LocalStorage for System Settings');
      const s = localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS);
      return s ? JSON.parse(s) : null;
    }
  },
  async updateSystemSettings(settings: any) {
    try {
      const dataToSave = {
        contact_name: settings.contactName,
        contact_phone: settings.contactPhone,
        contact_email: settings.contactEmail,
        pass_mark: settings.passMark,
        ai_analysis_enabled: settings.aiAnalysisEnabled,
        popup_enabled: settings.popupEnabled,
        popup_title: settings.popupTitle,
        popup_content: settings.popupContent,
        countdown_enabled: settings.countdownEnabled,
        countdown_target_date: settings.countdownTargetDate,
        countdown_title: settings.countdownTitle,
        countdown_subtitle: settings.countdownSubtitle,
      };
      await supabase.from('system_settings').update(dataToSave).eq('id', 'default');
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(settings));
  },
  
  async getUserProgress(): Promise<Record<string, { completedLessons: string[]; completedExams: { examId: string; score: number }[] }>> {
    try {
      const { data, error } = await supabase.from('user_progress').select('*');
      if (error) throw error;
      
      const progressRecord: Record<string, { completedLessons: string[]; completedExams: { examId: string; score: number }[] }> = {};
      data.forEach((p: any) => {
        progressRecord[p.user_id] = {
          completedLessons: p.completed_lessons || [],
          completedExams: p.completed_exams || []
        };
      });
      return progressRecord;
    } catch (_e) {
      console.warn('Fallback to LocalStorage for User Progress');
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROGRESS) || '{}');
    }
  },
  async saveUserProgress(progress: Record<string, { completedLessons: string[]; completedExams: { examId: string; score: number }[] }>) {
    try {
      // Vì progress là 1 object lớn chứa tất cả user_id, ta cần convert nó thành mảng để upsert (update or insert)
      const dataToUpsert = Object.keys(progress).map(userId => ({
        user_id: userId,
        completed_lessons: progress[userId].completedLessons,
        completed_exams: progress[userId].completedExams
      }));
      // Sử dụng upsert (chú ý cần thiết lập user_id là primary key trên supabase)
      await supabase.from('user_progress').upsert(dataToUpsert);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  },
  
  // Documents
  async getDocuments(): Promise<any[]> {
    try {
      const { data, error } = await supabase.from('documents').select('*');
      if (error) throw error;
      return data.map((d: any) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        format: d.format,
        size: d.size,
        downloads: d.downloads,
        uploadDate: d.upload_date,
        url: d.url,
      }));
    } catch (_e) {
      console.warn('Fallback to LocalStorage for Documents');
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTS) || '[]');
    }
  },
  async saveDocuments(docs: any[]) {
    try {
      // Vì saveDocuments thường lưu toàn bộ danh sách, ta cần xóa cũ thêm mới hoặc upsert
      const dataToUpsert = docs.map(d => ({
        id: d.id,
        title: d.title,
        category: d.category,
        format: d.format,
        size: d.size,
        downloads: d.downloads,
        upload_date: d.uploadDate,
        url: d.url,
      }));
      await supabase.from('documents').upsert(dataToUpsert);
    } catch (e) { console.error(e); }
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  },
  
  // Storage (Files)
  async uploadFile(file: File, folder: string = 'general'): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading file:', error);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (e) {
      console.error('Error in uploadFile:', e);
      return null;
    }
  },
};
