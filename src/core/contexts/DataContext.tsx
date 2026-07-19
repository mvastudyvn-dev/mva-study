import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Course, Lesson, Exam, ActivationCode, Teacher, NewsItem, LeaderboardEntry, NotificationItem, TopStudent, MonthlyStudentData, User, ConsultationForm, SystemSettings, DocumentItem } from '../types/global';
import { StorageService } from '../services/storage';

interface DataContextType {
  users: User[];
  courses: Course[];
  lessons: Lesson[];
  exams: Exam[];
  documents: DocumentItem[];
  activationCodes: ActivationCode[];
  consultations: ConsultationForm[];
  teachers: Teacher[];
  news: NewsItem[];
  leaderboard: LeaderboardEntry[];
  notifications: NotificationItem[];
  topStudents: TopStudent[];
  monthlyStats: MonthlyStudentData[];
  systemSettings: SystemSettings | null;
  allUserProgress: Record<string, { completedLessons: string[]; completedExams: { examId: string; score: number }[]; deductedPoints?: number }>;
  markLessonCompleted: (userId: string, lessonId: string) => void;
  markExamCompleted: (userId: string, examId: string, score: number) => void;
  addDocument: (doc: DocumentItem) => void;
  updateDocument: (id: string, doc: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  refreshData: () => void;
  resetLeaderboard: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activationCodes, setActivationCodes] = useState<ActivationCode[]>([]);
  const [consultations, setConsultations] = useState<ConsultationForm[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStudentData[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  
  // Progress state
  const [allUserProgress, setAllUserProgress] = useState<Record<string, { completedLessons: string[]; completedExams: { examId: string; score: number }[]; deductedPoints?: number }>>({});

  const refreshData = useCallback(async () => {
    const rawCourses = await StorageService.getCourses();
    const rawLessons = await StorageService.getLessons();
    const examsData = await StorageService.getExams();
    
    // Tự động đếm số lượng bài giảng cho từng khóa học
    const coursesWithCounts = rawCourses.map(course => ({
      ...course,
      lessonsCount: rawLessons.filter(l => l.courseId === course.id).length
    }));

    const usersData = await StorageService.getUsers();
    const settingsData = await StorageService.getSystemSettings();
    const progressData = await StorageService.getUserProgress();
    const codesData = await StorageService.getActivationCodes();
    const documentsData = await StorageService.getDocuments();

    setUsers(usersData);
    setCourses(coursesWithCounts);
    setLessons(rawLessons);
    setExams(examsData);
    setDocuments(documentsData);
    setActivationCodes(codesData);
    setConsultations(StorageService.getConsultations());
    setTeachers(StorageService.getTeachers());
    setNews(StorageService.getNews());
    setNotifications(StorageService.getNotifications());
    setTopStudents(StorageService.getTopStudents());
    setMonthlyStats(StorageService.getMonthlyStats());
    setSystemSettings(settingsData);
    setAllUserProgress(progressData);
  }, []);

  useEffect(() => {
    StorageService.initializeMockData();
    refreshData();
  }, [refreshData]);

  const dynamicLeaderboard = React.useMemo(() => {
    if (!users || users.length === 0) return [];
    
    const calculated = users.map(u => {
      const progress = allUserProgress[u.id];
      let points = 0;
      if (progress) {
        if (progress.completedLessons) {
          points += progress.completedLessons.length * 50;
        }
        if (progress.completedExams) {
          progress.completedExams.forEach(exam => {
            points += Math.round(exam.score * 10);
          });
        }
        if (progress.deductedPoints) {
          points -= progress.deductedPoints;
        }
      }
      return {
        id: u.id,
        name: u.name,
        points: Math.max(0, points),
        school: u.school || 'MVA Study',
        avatarColor: '#1E3A8A',
        avatar: u.avatar || `https://i.pravatar.cc/150?u=${u.id}`,
        rank: 0
      };
    });

    const sorted = calculated
      .filter(u => u.points > 0) 
      .sort((a, b) => b.points - a.points);
      
    return sorted.slice(0, 10).map((u, index) => ({
      ...u,
      rank: index + 1
    }));
  }, [users, allUserProgress]);

  const markLessonCompleted = useCallback((userId: string, lessonId: string) => {
    setAllUserProgress(prev => {
      const current = prev[userId] || { completedLessons: [], completedExams: [] };
      if (!current.completedLessons.includes(lessonId)) {
        const updated = {
          ...prev,
          [userId]: {
            ...current,
            completedLessons: [...current.completedLessons, lessonId]
          }
        };
        StorageService.saveUserProgress(updated);
        return updated;
      }
      return prev;
    });
  }, []);

  const resetLeaderboard = useCallback(() => {
    setAllUserProgress(prev => {
      const updated = { ...prev };
      users.forEach(u => {
        const progress = updated[u.id] || { completedLessons: [], completedExams: [] };
        let currentTotalPoints = 0;
        if (progress.completedLessons) {
          currentTotalPoints += progress.completedLessons.length * 50;
        }
        if (progress.completedExams) {
          progress.completedExams.forEach(exam => {
            currentTotalPoints += Math.round(exam.score * 10);
          });
        }
        updated[u.id] = {
          ...progress,
          deductedPoints: currentTotalPoints
        };
      });
      StorageService.saveUserProgress(updated);
      return updated;
    });
  }, [users]);

  const markExamCompleted = useCallback((userId: string, examId: string, score: number) => {
    setAllUserProgress(prev => {
      const current = prev[userId] || { completedLessons: [], completedExams: [] };
      const existingIndex = current.completedExams.findIndex(e => e.examId === examId);
      
      let newExams = [...current.completedExams];
      if (existingIndex >= 0) {
        if (score > newExams[existingIndex].score) {
          newExams[existingIndex].score = score;
        }
      } else {
        newExams.push({ examId, score });
      }

      const updated = {
        ...prev,
        [userId]: {
          ...current,
          completedExams: newExams
        }
      };
      StorageService.saveUserProgress(updated);
      return updated;
    });
  }, []);

  const addDocument = useCallback((doc: DocumentItem) => {
    setDocuments(prev => {
      const updated = [...prev, doc];
      StorageService.saveDocuments(updated);
      return updated;
    });
  }, []);

  const updateDocument = useCallback((id: string, data: Partial<DocumentItem>) => {
    setDocuments(prev => {
      const updated = prev.map(doc => doc.id === id ? { ...doc, ...data } : doc);
      StorageService.saveDocuments(updated);
      return updated;
    });
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => {
      const updated = prev.filter(doc => doc.id !== id);
      StorageService.saveDocuments(updated);
      return updated;
    });
  }, []);

  const contextValue = useMemo(() => ({
    users, courses, lessons, exams, documents, activationCodes, consultations, 
    teachers, news, leaderboard: dynamicLeaderboard, notifications, topStudents, 
    monthlyStats, systemSettings, refreshData, allUserProgress, 
    markLessonCompleted, markExamCompleted, addDocument, updateDocument, deleteDocument, resetLeaderboard
  }), [
    users, courses, lessons, exams, documents, activationCodes, consultations, 
    teachers, news, dynamicLeaderboard, notifications, topStudents, 
    monthlyStats, systemSettings, refreshData, allUserProgress, 
    markLessonCompleted, markExamCompleted, addDocument, updateDocument, deleteDocument, resetLeaderboard
  ]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
