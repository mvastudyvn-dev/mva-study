import type { User } from '../../../core/types/global';

export const mockAdminUser: User = {
  id: 'admin-1',
  name: 'Admin',
  email: 'admin@mvastudy.vn',
  role: 'admin',
  status: 'active'
};

export const mockStudentUser: User = {
  id: 's1',
  name: 'Học sinh',
  email: 'student@gmail.com',
  role: 'student',
  status: 'active'
};

export const mockUsers: User[] = [];
