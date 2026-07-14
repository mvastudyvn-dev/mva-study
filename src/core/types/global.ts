export type Role = 'student' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  password?: string;
  username?: string;
  phone?: string;
  avatar?: string;
  enrolledCourses?: string[];
  points?: number;
  totalTime?: string;
  completedCoursesCount?: number;
  class?: string;
  dob?: string;
  school?: string;
  province?: string;
  status?: 'active' | 'locked';
  joinDate?: string;
}

export interface UserProgress {
  userId: string;
  completedLessons: string[];
  completedExams: { examId: string; score: number }[];
}

export interface Course {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  lessonsCount: number;
  rating: number;
  ratingCount: number;
  price: number;
  colorCode: string;
  bgGradient: string;
  durationMonths?: number;
}

export interface UserCourse {
  courseId: string;
  progress: number;
  isActive: boolean;
}

export interface ActivationCode {
  code: string;
  courseId: string;
  courseName: string;
  status: 'Đã sử dụng' | 'Chưa sử dụng';
  isUsed: boolean;
  usedByEmail?: string;
  activationDate?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  format: 'PDF' | 'DOCX' | 'XLSX' | 'ZIP';
  size: string;
  downloads: number;
  uploadDate: string;
  url: string;
}

export interface Teacher {
  id: string;
  name: string;
  title: string;
  courses: string;
  experience: string;
  rating: number;
  ratingCount: number;
  avatarGradient: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  avatarColor: string;
  school?: string;
  avatar?: string;
}

export interface StudentStats {
  activeCourses: number;
  completedLessons: number;
  completionRate: number;
  totalHours: number;
}

export interface WeeklyStats {
  studyTime: string;
  lessonsCompleted: number;
  exercisesDone: number;
  wrongAnswers: number;
  studyTimeChange: number;
  lessonsChange: number;
  exercisesChange: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'info' | 'course' | 'system';
}

export interface ConsultationForm {
  id: string;
  name: string;
  phone: string;
  email: string;
  courseInterest: string;
  content: string;
  date: string;
}

export interface TopStudent {
  rank: number;
  name: string;
  points: number;
  coursesCount: number;
  studyHours: string;
}

export interface MonthlyStudentData {
  month: string;
  newStudents: number;
  activeStudents: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  videoUrl: string;
  order: number;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  timeLimit: number; // in minutes
  format: 'standard' | 'thpt_2025';
  fileUrl: string;
  answerKey?: any; // To store complex answer structures
}

export interface SystemSettings {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  passMark: number;
  aiAnalysisEnabled: boolean;
  popupEnabled: boolean;
  popupTitle: string;
  popupContent: string;
  countdownEnabled: boolean;
  countdownTargetDate: string;
  countdownTitle: string;
  countdownSubtitle: string;
}
