import { getAuthToken, logout as authLogout, login as authLogin, isAuthenticated as checkAuth, getUser as getStoredUser } from '@/lib/auth';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://csamz-backend.onrender.com/api';

const GET_CACHE_TTL_MS = 15000;
const requestCache = new Map<string, { expiresAt: number; data: unknown }>();
const inflightGetRequests = new Map<string, Promise<unknown>>();

const cloneCachedData = <T,>(data: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(data);
  }

  try {
    return JSON.parse(JSON.stringify(data)) as T;
  } catch {
    return data;
  }
};

const buildGetCacheKey = (scope: string, endpoint: string, token: string | null) => `${scope}:${token || 'guest'}:${endpoint}`;

const getCachedResponse = <T,>(cacheKey: string): T | null => {
  const cached = requestCache.get(cacheKey);
  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    requestCache.delete(cacheKey);
    return null;
  }

  return cloneCachedData(cached.data as T);
};

const setCachedResponse = <T,>(cacheKey: string, data: T) => {
  requestCache.set(cacheKey, {
    expiresAt: Date.now() + GET_CACHE_TTL_MS,
    data: cloneCachedData(data),
  });
};

const invalidateRequestCache = () => {
  requestCache.clear();
  inflightGetRequests.clear();
};

const extractApiErrorMessage = (data: any, fallback: string) => {
  if (data?.message && typeof data.message === 'string') {
    return data.message;
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const firstError = data.errors[0];
    if (typeof firstError === 'string') {
      return firstError;
    }

    if (firstError?.msg && typeof firstError.msg === 'string') {
      return firstError.msg;
    }
  }

  if (typeof data === 'string' && data) {
    return data;
  }

  return fallback;
};

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const method = (options.method || 'GET').toUpperCase();

  // Initialize headers
  const headers: HeadersInit = {};

  // Only set Content-Type to JSON if body is not FormData and not already set
  if (!(options.body instanceof FormData) && !options.headers?.['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (method !== 'GET') {
    invalidateRequestCache();
  }

  const cacheKey = method === 'GET' ? buildGetCacheKey('admin', endpoint, token) : null;

  if (cacheKey) {
    const cached = getCachedResponse<T>(cacheKey);
    if (cached) {
      return cached;
    }

    const inflightRequest = inflightGetRequests.get(cacheKey);
    if (inflightRequest) {
      return cloneCachedData(await inflightRequest as T);
    }
  }

  try {
    const fetchRequest = (async () => {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
        if (data) {
          try {
            data = JSON.parse(data);
          } catch (e) {
            // If not JSON, keep as text
          }
        }
      }

      // Only force admin logout/redirect when an authenticated admin request expires.
      if (response.status === 401 && token) {
        authLogout();
        window.location.href = '/admin/login';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(extractApiErrorMessage(data, `API request failed with status ${response.status}`));
      }

      if (cacheKey) {
        setCachedResponse(cacheKey, data);
      }

      return data as T;
    })();

    if (cacheKey) {
      inflightGetRequests.set(cacheKey, fetchRequest);
      fetchRequest.finally(() => {
        inflightGetRequests.delete(cacheKey);
      });
    }

    return cloneCachedData(await fetchRequest);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
}

// Blog Types
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string | null;
  author_id?: number | null;
  author_name?: string | null;
  published_date: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  published_date: string;
  is_published?: boolean;
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> { }

// Blog API
export const blogApi = {
  getPublished: async (): Promise<{ success: boolean; count: number; posts: BlogPost[] }> => {
    return apiRequest<{ success: boolean; count: number; posts: BlogPost[] }>('/blog');
  },

  getBySlug: async (slug: string): Promise<{ success: boolean; post: BlogPost }> => {
    return apiRequest<{ success: boolean; post: BlogPost }>(`/blog/${slug}`);
  },

  adminList: async (): Promise<{ success: boolean; count: number; posts: BlogPost[] }> => {
    return apiRequest<{ success: boolean; count: number; posts: BlogPost[] }>('/blog/admin');
  },

  adminGetById: async (id: number): Promise<{ success: boolean; post: BlogPost }> => {
    return apiRequest<{ success: boolean; post: BlogPost }>(`/blog/admin/${id}`);
  },

  create: async (payload: CreateBlogPostData): Promise<{ success: boolean; message: string; post: BlogPost }> => {
    return apiRequest<{ success: boolean; message: string; post: BlogPost }>('/blog', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: number, payload: UpdateBlogPostData): Promise<{ success: boolean; message: string; post: BlogPost }> => {
    return apiRequest<{ success: boolean; message: string; post: BlogPost }>(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(`/blog/${id}`, {
      method: 'DELETE',
    });
  },
};

// News Article Types
export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  image_urls: string[];
  author_id?: number;
  published_date: string;
  created_at?: string;
  updated_at?: string;
  author_username?: string;
  author_name?: string;
}

export interface CreateArticleData {
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  image_urls?: string[];
  published_date: string;
}

export interface UpdateArticleData {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  image_urls?: string[];
  published_date?: string;
}

// Auth Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name: string;
  role?: 'admin' | 'super_admin';
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
}

// News API
export const newsApi = {
  // Get all articles
  getAll: async (): Promise<{ success: boolean; count: number; articles: NewsArticle[] }> => {
    return apiRequest<{ success: boolean; count: number; articles: NewsArticle[] }>('/news');
  },

  // Get single article
  getById: async (id: number): Promise<{ success: boolean; article: NewsArticle }> => {
    return apiRequest<{ success: boolean; article: NewsArticle }>(`/news/${id}`);
  },

  // Create article (requires auth)
  async create(data: CreateArticleData) {
    // Ensure image_urls is always an array
    const payload = {
      ...data,
      image_urls: data.image_urls || []
    };

    return apiRequest<{ success: boolean; message: string; article: NewsArticle }>('/news', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Update article (requires auth)
  async update(id: number, data: UpdateArticleData) {
    // Ensure image_urls is always an array if provided
    const payload = data.image_urls ? {
      ...data,
      image_urls: data.image_urls
    } : data;

    return apiRequest<{ success: boolean; message: string; article?: NewsArticle }>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Delete article (requires auth)
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(`/news/${id}`, {
      method: 'DELETE',
    });
  },
};

// Student Auth Types
export interface StudentUser {
  id: string;
  username: string;
  full_name: string;
  email?: string | null;
  phone_number?: string | null;
  trade?: string | null;
  level?: 'L3' | 'L4' | 'L5';
  role: 'student';
  status?: 'active' | 'inactive';
}

export interface StudentLoginData {
  username: string;
  password: string;
}

export interface StudentRegisterData extends StudentLoginData {
  full_name: string;
  email?: string;
  phone_number: string;
  trade: string;
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
}

const STUDENT_TOKEN_KEY = 'studentAuthToken';
const STUDENT_USER_KEY = 'studentUser';

const studentAuthStorage = {
  getToken(): string | null {
    return localStorage.getItem(STUDENT_TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(STUDENT_TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(STUDENT_TOKEN_KEY);
  },
  getUser(): StudentUser | null {
    const stored = localStorage.getItem(STUDENT_USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as StudentUser;
    } catch {
      return null;
    }
  },
  setUser(user: StudentUser) {
    localStorage.setItem(STUDENT_USER_KEY, JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem(STUDENT_USER_KEY);
  },
};

const studentApiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = studentAuthStorage.getToken();
  const method = (options.method || 'GET').toUpperCase();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (method !== 'GET') {
    invalidateRequestCache();
  }

  const cacheKey = method === 'GET' ? buildGetCacheKey('student', endpoint, token) : null;

  if (cacheKey) {
    const cached = getCachedResponse<T>(cacheKey);
    if (cached) {
      return cached;
    }

    const inflightRequest = inflightGetRequests.get(cacheKey);
    if (inflightRequest) {
      return cloneCachedData(await inflightRequest as T);
    }
  }

  const fetchRequest = (async () => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(extractApiErrorMessage(data, 'Request failed'));
    }

    if (cacheKey) {
      setCachedResponse(cacheKey, data);
    }

    return data as T;
  })();

  if (cacheKey) {
    inflightGetRequests.set(cacheKey, fetchRequest);
    fetchRequest.finally(() => {
      inflightGetRequests.delete(cacheKey);
    });
  }

  return cloneCachedData(await fetchRequest);
};

export const studentAuthApi = {
  register: async (payload: StudentRegisterData) => {
    const response = await apiRequest<{
      success: boolean;
      message: string;
      token: string;
      student: StudentUser;
    }>('/student/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.success) {
      studentAuthStorage.setToken(response.token);
      studentAuthStorage.setUser(response.student);
    }

    return response;
  },

  login: async (payload: StudentLoginData) => {
    const response = await apiRequest<{
      success: boolean;
      message: string;
      token: string;
      student: StudentUser;
    }>('/student/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.success) {
      studentAuthStorage.setToken(response.token);
      studentAuthStorage.setUser(response.student);
    }

    return response;
  },

  logout: () => {
    studentAuthStorage.clearToken();
    studentAuthStorage.clearUser();
  },

  getCurrentStudent: async () => {
    return studentApiRequest<{
      success: boolean;
      student: StudentUser & { status: 'active' | 'inactive' };
    }>('/student/auth/me');
  },

  getStoredStudent: (): StudentUser | null => {
    return studentAuthStorage.getUser();
  },

  isAuthenticated: () => {
    return !!studentAuthStorage.getToken();
  },

  updateProfile: async (data: {
    full_name?: string;
    email?: string;
    phone_number?: string;
    trade?: string;
    level?: 'L3' | 'L4' | 'L5';
  }) => {
    const response = await studentApiRequest<{
      success: boolean;
      message: string;
      student: StudentUser;
    }>('/student/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (response.success) {
      // Update stored user data
      const currentUser = studentAuthStorage.getUser();
      if (currentUser) {
        studentAuthStorage.setUser({
          ...currentUser,
          ...response.student,
        });
      }
    }

    return response;
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
  }) => {
    return studentApiRequest<{
      success: boolean;
      message: string;
    }>('/student/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Auth API
export const authApi = {
  // Login
  login: async (data: LoginData): Promise<{ success: boolean; message: string; token: string; user: User }> => {
    const response = await apiRequest<{ success: boolean; message: string; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Store token using auth utility
    if (response.token && response.user) {
      authLogin(response.token, response.user);
    }

    return response;
  },

  // Register
  register: async (data: RegisterData): Promise<{ success: boolean; message: string; token: string; user: User }> => {
    const response = await apiRequest<{ success: boolean; message: string; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Store token using auth utility
    if (response.token && response.user) {
      authLogin(response.token, response.user);
    }

    return response;
  },

  // Get current user
  getCurrentUser: async (): Promise<{ success: boolean; user: User }> => {
    return apiRequest<{ success: boolean; user: User }>('/auth/me');
  },

  // Logout
  logout: () => {
    authLogout();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return checkAuth();
  },

  // Get stored user
  getStoredUser: (): User | null => {
    return getStoredUser();
  },
};

// Application Types
export interface StudentApplication {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  program: string;
  previous_school?: string;
  previous_qualification?: string;
  guardian_name?: string;
  guardian_phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  approved_by?: number;
  approved_by_username?: string;
  approved_by_name?: string;
  approved_at?: string;
  created_at?: string;
  updated_at?: string;
  report_path?: string | null;
  report_url?: string | null;
}

export interface CreateApplicationData {
  full_name: string;
  email?: string;
  phone_number: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  program: string;
  previous_school?: string;
  previous_qualification?: string;
  guardian_name?: string;
  guardian_phone?: string;
}

export interface UpdateApplicationStatusData {
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
}

// Applications API
export const applicationsApi = {
  // Get all applications (requires auth)
  getAll: async (filters?: { status?: string; program?: string }): Promise<{ success: boolean; count: number; applications: StudentApplication[] }> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.program) params.append('program', filters.program);

    const queryString = params.toString();
    return apiRequest<{ success: boolean; count: number; applications: StudentApplication[] }>(
      `/applications${queryString ? '?' + queryString : ''}`
    );
  },

  // Get single application (requires auth)
  getById: async (id: number): Promise<{ success: boolean; application: StudentApplication }> => {
    return apiRequest<{ success: boolean; application: StudentApplication }>(`/applications/${id}`);
  },

  // Submit application (public) - supports file uploads
  create: async (data: CreateApplicationData & { report?: File }): Promise<{ success: boolean; message: string; application: StudentApplication }> => {
    // If there's a file, use FormData, otherwise send as JSON
    if (data.report) {
      const formData = new FormData();

      // Append all data fields to formData
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'report' && value !== undefined) {
          formData.append(key, value as string);
        }
      });

      // Append the file
      formData.append('report', data.report);

      return apiRequest<{ success: boolean; message: string; application: StudentApplication }>('/applications', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let the browser set it with the correct boundary
        headers: {}
      });
    } else {
      // For non-file submissions, send as JSON
      return apiRequest<{ success: boolean; message: string; application: StudentApplication }>('/applications', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  },

  // Update application status (requires auth)
  updateStatus: async (id: number, data: UpdateApplicationStatusData): Promise<{ success: boolean; message: string; application: StudentApplication; sms_sent: boolean }> => {
    return apiRequest<{ success: boolean; message: string; application: StudentApplication; sms_sent: boolean }>(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete application (requires auth)
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(`/applications/${id}`, {
      method: 'DELETE',
    });
  },

  // Get statistics (requires auth)
  getStats: async (): Promise<{ success: boolean; stats: any; programStats: any[] }> => {
    return apiRequest<{ success: boolean; stats: any; programStats: any[] }>('/applications/stats/overview');
  },
};

// Holiday Assessment Types
export interface HolidayAssessment {
  id: number;
  title: string;
  description: string | null;
  instructions: string | null;
  trade: string | null;
  subject?: string | null;
  start_at: string | null;
  end_at: string | null;
  duration_minutes: number | null;
  status: 'draft' | 'published' | 'archived';
  allow_multiple_attempts: boolean;
  max_attempts: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface HolidayAssessmentQuestion {
  id: number;
  question_text: string;
  explanation: string | null;
  points: number;
  position: number;
  choices: HolidayAssessmentChoice[];
}

export interface HolidayAssessmentChoice {
  id: number;
  choice_text: string;
  is_correct: boolean;
  position: number;
}

export interface CreateHolidayAssessmentData {
  title: string;
  description?: string;
  instructions?: string;
  trade?: string;
  subject?: string;
  start_at?: string;
  end_at?: string;
  duration_minutes?: number;
  status?: 'draft' | 'published' | 'archived';
  allow_multiple_attempts?: boolean;
  max_attempts?: number;
}

export interface UpdateHolidayAssessmentData extends Partial<CreateHolidayAssessmentData> { }

export interface CreateHolidayQuestionData {
  question_text: string;
  explanation?: string;
  points?: number;
  position?: number;
  choices: Array<{
    choice_text: string;
    is_correct: boolean;
    position?: number;
  }>;
}

export interface UpdateHolidayQuestionData extends Partial<CreateHolidayQuestionData> {
  choices?: Array<{
    id?: number;
    choice_text: string;
    is_correct: boolean;
    position?: number;
  }>;
}

export interface StartHolidayAttemptData {
  student_identifier: string;
  student_name?: string;
}

export interface SubmitHolidayAttemptData {
  answers: Array<{
    question_id: number;
    choice_id: number;
  }>;
}

export interface HolidayAssessmentAttempt {
  id: number;
  assessment_id: number;
  student_identifier: string;
  student_name: string | null;
  attempt_number: number;
  status: 'in_progress' | 'submitted' | 'graded';
  score: number | null;
  started_at: string;
  submitted_at: string | null;
  duration_minutes: number | null;
  answers?: Array<{
    question_id: number;
    question_text: string;
    choice_id: number | null;
    choice_text: string | null;
    is_correct: boolean;
    points_awarded: number;
    max_points: number;
    was_choice_correct: boolean;
  }>;
}

export const holidayAssessmentsApi = {
  list: async (filters?: { status?: 'draft' | 'published' | 'archived'; upcoming?: boolean; active?: boolean; trade?: string }): Promise<{
    success: boolean;
    count: number;
    assessments: HolidayAssessment[];
  }> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.upcoming) params.append('upcoming', String(filters.upcoming));
    if (filters?.active) params.append('active', String(filters.active));
    if (filters?.trade) params.append('trade', filters.trade);

    const qs = params.toString();
    return apiRequest<{ success: boolean; count: number; assessments: HolidayAssessment[] }>(
      `/holiday-assessments${qs ? `?${qs}` : ''}`
    );
  },

  create: async (data: CreateHolidayAssessmentData) => {
    return apiRequest<{ success: boolean; assessment: HolidayAssessment }>('/holiday-assessments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById: async (id: number): Promise<{
    success: boolean;
    assessment: HolidayAssessment;
    questions: HolidayAssessmentQuestion[];
  }> => {
    return apiRequest<{
      success: boolean;
      assessment: HolidayAssessment;
      questions: HolidayAssessmentQuestion[];
    }>(`/holiday-assessments/${id}`);
  },

  update: async (id: number, data: UpdateHolidayAssessmentData) => {
    return apiRequest<{ success: boolean; assessment: HolidayAssessment }>(`/holiday-assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  remove: async (id: number) => {
    return apiRequest<{ success: boolean; message: string }>(`/holiday-assessments/${id}`, {
      method: 'DELETE',
    });
  },

  addQuestion: async (assessmentId: number, data: CreateHolidayQuestionData) => {
    return apiRequest<{ success: boolean; question: HolidayAssessmentQuestion }>(
      `/holiday-assessments/${assessmentId}/questions`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  updateQuestion: async (questionId: number, data: UpdateHolidayQuestionData) => {
    return apiRequest<{ success: boolean; question: HolidayAssessmentQuestion }>(
      `/holiday-assessments/questions/${questionId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  deleteQuestion: async (questionId: number) => {
    return apiRequest<{ success: boolean; message: string }>(
      `/holiday-assessments/questions/${questionId}`,
      {
        method: 'DELETE',
      }
    );
  },

  startAttempt: async (assessmentId: number, data: StartHolidayAttemptData) => {
    return apiRequest<{ success: boolean; attempt: HolidayAssessmentAttempt }>(
      `/holiday-assessments/${assessmentId}/attempts`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  submitAttempt: async (attemptId: number, data: SubmitHolidayAttemptData) => {
    return apiRequest<{ success: boolean; message: string; score: number }>(
      `/holiday-assessments/attempts/${attemptId}/submit`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  getAttempt: async (attemptId: number) => {
    return apiRequest<{ success: boolean; attempt: HolidayAssessmentAttempt }>(
      `/holiday-assessments/attempts/${attemptId}`
    );
  },
};

// Teacher Auth Types
export interface TeacherUser {
  id: string;
  full_name: string;
  username: string;
  email: string;
  trade: string;
  trades?: string[];
  level?: 'L3' | 'L4' | 'L5';
  levels?: Array<'L3' | 'L4' | 'L5'>;
  role: 'teacher';
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface TeacherRegisterData {
  full_name: string;
  username: string;
  email: string;
  password: string;
  trades: string[];
  levels: Array<'L3' | 'L4' | 'L5'>;
}

export interface TeacherLoginData {
  email: string;
  password: string;
}

export interface TeacherProfileUpdateData {
  full_name?: string;
  username?: string;
  email?: string;
  trades?: string[];
  levels?: Array<'L3' | 'L4' | 'L5'>;
}

const TEACHER_TOKEN_KEY = 'teacherAuthToken';
const TEACHER_USER_KEY = 'teacherUser';

const teacherAuthStorage = {
  getToken(): string | null {
    return localStorage.getItem(TEACHER_TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TEACHER_TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TEACHER_TOKEN_KEY);
  },
  getUser(): TeacherUser | null {
    const stored = localStorage.getItem(TEACHER_USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as TeacherUser;
    } catch {
      return null;
    }
  },
  setUser(user: TeacherUser) {
    localStorage.setItem(TEACHER_USER_KEY, JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem(TEACHER_USER_KEY);
  },
};

const teacherApiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = teacherAuthStorage.getToken();
  const method = (options.method || 'GET').toUpperCase();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (method !== 'GET') {
    invalidateRequestCache();
  }

  const cacheKey = method === 'GET' ? buildGetCacheKey('teacher', endpoint, token) : null;

  if (cacheKey) {
    const cached = getCachedResponse<T>(cacheKey);
    if (cached) {
      return cached;
    }

    const inflightRequest = inflightGetRequests.get(cacheKey);
    if (inflightRequest) {
      return cloneCachedData(await inflightRequest as T);
    }
  }

  const fetchRequest = (async () => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(extractApiErrorMessage(data, 'Request failed'));
    }

    if (cacheKey) {
      setCachedResponse(cacheKey, data);
    }

    return data as T;
  })();

  if (cacheKey) {
    inflightGetRequests.set(cacheKey, fetchRequest);
    fetchRequest.finally(() => {
      inflightGetRequests.delete(cacheKey);
    });
  }

  return cloneCachedData(await fetchRequest);
};

export const teacherAuthApi = {
  register: async (payload: TeacherRegisterData) => {
    return apiRequest<{
      success: boolean;
      message: string;
      teacher?: TeacherUser;
    }>('/teacher/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login: async (payload: TeacherLoginData) => {
    const response = await apiRequest<{
      success: boolean;
      message: string;
      token: string;
      teacher: TeacherUser;
    }>('/teacher/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.success && response.token && response.teacher) {
      teacherAuthStorage.setToken(response.token);
      teacherAuthStorage.setUser(response.teacher);
    }

    return response;
  },

  logout: () => {
    teacherAuthStorage.clearToken();
    teacherAuthStorage.clearUser();
  },

  getCurrentTeacher: async () => {
    const response = await teacherApiRequest<{
      success: boolean;
      teacher: TeacherUser;
    }>('/teacher/auth/me');

    if (response.success && response.teacher) {
      teacherAuthStorage.setUser(response.teacher);
    }

    return response;
  },

  getStoredTeacher: (): TeacherUser | null => {
    return teacherAuthStorage.getUser();
  },

  isAuthenticated: () => {
    return Boolean(teacherAuthStorage.getToken());
  },

  updateProfile: async (data: TeacherProfileUpdateData) => {
    const response = await teacherApiRequest<{
      success: boolean;
      message: string;
      teacher: TeacherUser;
    }>('/teacher/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (response.success && response.teacher) {
      teacherAuthStorage.setUser(response.teacher);
    }

    return response;
  },

  changePassword: async (data: { current_password: string; new_password: string }) => {
    return teacherApiRequest<{
      success: boolean;
      message: string;
    }>('/teacher/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export const teacherAdminApi = {
  list: async (): Promise<{ success: boolean; teachers: TeacherUser[] }> => {
    return apiRequest<{ success: boolean; teachers: TeacherUser[] }>('/teacher/auth/admin/list');
  },

  updateStatus: async (id: number, status: 'pending' | 'approved' | 'rejected') => {
    return apiRequest<{
      success: boolean;
      message: string;
      email: {
        attempted: boolean;
        sent: boolean;
        error: string | null;
      };
    }>(`/teacher/auth/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Online Exams Types
export interface ExamSummary {
  id: string;
  title: string;
  description?: string | null;
  total_marks: number;
  teacher_id?: string | null;
  trade: string | null;
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  question_count?: number;
  created_at?: string;
  exam_code?: string | null;
  teacher_name?: string | null;
  already_taken?: boolean;
  status?: 'draft' | 'published';
}

export interface ExamQuestion {
  id: string;
  question_text: string;
  type: 'MCQ' | 'TF';
  options: string[];
  marks: number;
  time_limit: number;
}

export interface ExamDetail {
  id: string;
  title: string;
  description?: string | null;
  total_marks: number;
  teacher_id?: string | null;
  trade: string | null;
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  exam_code?: string | null;
  teacher_name?: string | null;
  created_at?: string;
  updated_at?: string;
  question_count?: number;
  already_taken?: boolean;
  status?: 'draft' | 'published';
  grades_published?: boolean;
  grades_published_at?: string | null;
}

export interface SubmitExamPayload {
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
}

export interface ExamSubmissionFeedback {
  questionId: number;
  questionText: string;
  studentAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  marks: number;
  marksAwarded: number;
}

export interface ExamSubmissionResponse {
  success: boolean;
  message: string;
  score: number;
  total_marks: number;
  percentage: number;
  grade: string;
  feedback: ExamSubmissionFeedback[];
}

export interface ExamResultAnswer extends ExamSubmissionFeedback {
  type: 'MCQ' | 'TF';
  options: string[];
}

export interface ExamResultResponse {
  success: boolean;
  exam: ExamDetail;
  result: {
    student_id: string;
    exam_id: string;
    score: number;
    percentage?: number;
    grade?: string;
    rank?: number | null;
    submitted_at: string;
  };
  ranking?: Array<{
    rank: number;
    student_id: string;
    full_name: string;
    username: string;
    score: number;
    total_marks: number;
    percentage: number;
    submitted_at: string;
  }>;
  answers: ExamResultAnswer[];
}

export interface TeacherExamResult {
  id: string;
  student_id: string;
  full_name: string;
  username: string;
  score: number;
  total_marks: number;
  percentage: number;
  grade: string;
  submitted_at: string;
}

export interface TeacherExamResultsResponse {
  success: boolean;
  exam_title: string;
  grades_published: boolean;
  grades_published_at?: string | null;
  results: TeacherExamResult[];
  stats?: {
    total_submissions: number;
    pass_count: number;
    fail_count: number;
    winning_rate: number;
    average_score: number;
  };
}

export interface StudentHistoryResult {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  rank?: number | null;
  trade?: string | null;
  level?: string | null;
  gradesPublished?: boolean;
  submittedAt: string;
}

export interface StudentClassSummary {
  trade: string;
  level: string;
  exams_taken: number;
  student_average: number;
  class_average: number;
  student_rank: number | null;
  class_size: number;
}

export interface StudentClassSubjectSummary {
  subject: string;
  exams_taken: number;
  student_average: number;
  class_average: number;
  student_rank: number | null;
  class_size: number;
}

export interface StudentClassLeaderboardEntry {
  rank: number;
  student_id: string;
  full_name: string;
  username: string;
  exams_taken: number;
  average_percentage: number;
}

export const examApi = {
  list: async (params?: { teacherId?: string | number }): Promise<{ success: boolean; exams: ExamSummary[] }> => {
    const queryString = params?.teacherId ? `?teacherId=${params.teacherId}` : "";
    return studentApiRequest<{ success: boolean; exams: ExamSummary[] }>(`/exams${queryString}`);
  },

  getQuestions: async (
    examId: string
  ): Promise<{ success: boolean; exam: ExamDetail; questions: ExamQuestion[] }> => {
    return studentApiRequest<{ success: boolean; exam: ExamDetail; questions: ExamQuestion[] }>(
      `/exams/${examId}/questions`
    );
  },

  submitAnswers: async (examId: string, payload: SubmitExamPayload) => {
    return studentApiRequest<ExamSubmissionResponse>(`/exams/${examId}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getResult: async (studentId: string, examId: string) => {
    return studentApiRequest<ExamResultResponse>(`/results/${studentId}/${examId}`);
  },

  getStudentHistory: async () => {
    return studentApiRequest<{ success: boolean; results: StudentHistoryResult[] }>(`/results/history`);
  },

  getClassSummary: async () => {
    return studentApiRequest<{
      success: boolean;
      has_published_grades: boolean;
      summary: StudentClassSummary | null;
      subjects: StudentClassSubjectSummary[];
      leaderboard: StudentClassLeaderboardEntry[];
    }>(`/results/class-summary`);
  },
};


export interface ExamQuestionManage extends ExamQuestion {
  correct_answer: string;
}

export const teacherExamApi = {
  list: async (teacherId?: string | number): Promise<{ success: boolean; exams: ExamSummary[] }> => {
    const params = teacherId ? `?teacherId=${teacherId}` : "";
    return teacherApiRequest<{ success: boolean; exams: ExamSummary[] }>(`/exams${params}`);
  },

  create: async (payload: {
    title: string;
    description?: string;
    total_marks?: number;
    exam_code?: string;
    level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
    trade: string;
  }) => {
    return teacherApiRequest<{ success: boolean; exam: ExamSummary }>(`/exams`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (
    examId: string | number,
    payload: {
      title: string;
      description?: string;
      total_marks?: number;
      level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
      trade: string;
    }
  ) => {
    return teacherApiRequest<{ success: boolean; exam: ExamSummary }>(`/exams/${examId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (examId: string | number) => {
    return teacherApiRequest<{ success: boolean; message: string }>(`/exams/${examId}`, {
      method: "DELETE",
    });
  },
  publish: async (examId: string | number) => {
    return teacherApiRequest<{ success: boolean; message: string; exam: ExamSummary }>(`/exams/${examId}/publish`, {
      method: "PATCH",
    });
  },

  getManageDetail: async (
    examId: string | number
  ): Promise<{ success: boolean; exam: ExamDetail; questions: ExamQuestionManage[] }> => {
    return teacherApiRequest<{ success: boolean; exam: ExamDetail; questions: ExamQuestionManage[] }>(
      `/exams/${examId}/manage`
    );
  },

  addQuestion: async (
    examId: string | number,
    payload: { question_text: string; type: "MCQ" | "TF"; options?: string[]; correct_answer: string; marks: number }
  ) => {
    return teacherApiRequest(`/exams/${examId}/questions`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateQuestion: async (
    questionId: number,
    payload: Partial<{ question_text: string; type: "MCQ" | "TF"; options?: string[]; correct_answer: string; marks: number }>
  ) => {
    return teacherApiRequest(`/exams/questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteQuestion: async (questionId: number) => {
    return teacherApiRequest(`/exams/questions/${questionId}`, {
      method: "DELETE",
    });
  },
  getExamResults: async (examId: string | number): Promise<TeacherExamResultsResponse> => {
    return teacherApiRequest<TeacherExamResultsResponse>(`/exams/${examId}/results`);
  },
  publishGrades: async (examId: string | number) => {
    return teacherApiRequest<{
      success: boolean;
      message: string;
      exam: {
        id: string;
        title: string;
        grades_published: boolean;
        grades_published_at?: string | null;
      };
    }>(`/exams/${examId}/results/publish`, {
      method: "PATCH",
    });
  },
};

// Student Dashboard Types

export interface StudentStats {
  attendance: number;
  assignments: number;
  grades: number;
  class_rank?: number | null;
  class_size?: number;
  total_attendance_days?: number;
  present_attendance_days?: number;
}

export interface StudentPerformancePoint {
  exam_name: string;
  score: number;
  date: string;
}

export interface StudentAttendance {
  id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

export interface StudentAssignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
  teacher_name?: string;
  file_path?: string;
  submission_id?: number | null;
  submitted_at?: string | null;
  grade?: number | null;
  feedback?: string | null;
}

export interface StudentNotification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
}

// Student Dashboard APIs

export const studentAnalyticsApi = {
  getStats: async () => {
    return studentApiRequest<{ success: boolean; stats: StudentStats }>('/student/analytics/stats');
  },
  getPerformance: async () => {
    return studentApiRequest<{ success: boolean; performanceData: StudentPerformancePoint[] }>('/student/analytics/performance');
  }
};

export const studentAttendanceApi = {
  getHistory: async (month?: number, year?: number) => {
    const qs = month && year ? `?month=${month}&year=${year}` : '';
    return studentApiRequest<{ success: boolean; attendance: StudentAttendance[] }>(`/student/attendance${qs}`);
  },
  getSummary: async () => {
    return studentApiRequest<{ success: boolean; summary: Record<string, number> }>('/student/attendance/summary');
  }
};

export const studentAssignmentsApi = {
  getAll: async () => {
    return studentApiRequest<{ success: boolean; assignments: StudentAssignment[] }>('/student/assignments');
  },
  getById: async (id: number) => {
    return studentApiRequest<{ success: boolean; assignment: StudentAssignment; submission?: any }>(`/student/assignments/${id}`);
  },
  submit: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = studentAuthStorage.getToken();
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/student/assignments/${id}/submit`, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Submission failed');
    return data;
  }
};

export const studentNotificationsApi = {
  getAll: async () => {
    return studentApiRequest<{ success: boolean; notifications: StudentNotification[]; unreadCount: number }>('/student/notifications');
  },
  markRead: async (id: number) => {
    return studentApiRequest<{ success: boolean }>(`/student/notifications/${id}/read`, { method: 'PUT' });
  },
  markAllRead: async () => {
    return studentApiRequest<{ success: boolean }>('/student/notifications/read-all', { method: 'PUT' });
  }
};

// Teacher Dashboard Types & APIs

export interface TeacherStats {
  totalStudents: number;
  totalAssignments: number;
  pendingGrading: number;
  totalExams: number;
  trade: string;
}

export interface TeacherStudent {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  trade: string;
  level: string;
  status: string;
  created_at: string;
}

export interface TeacherAssignment {
  id: number;
  title: string;
  description: string;
  trade: string;
  level: string;
  deadline: string;
  teacher_id: number;
  file_path?: string;
  created_at: string;
  submission_count: number;
}

export interface StudentSubmission {
  id: number;
  assignment_id: number;
  student_id: number;
  file_path: string;
  grade?: number;
  feedback?: string;
  submitted_at: string;
  full_name: string;
  email: string;
  level: string;
}

export interface AttendanceRecord {
  id: number;
  student_id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
  recorded_by: number;
  full_name: string;
  trade: string;
}

export const teacherStatsApi = {
  get: async () => {
    return teacherApiRequest<{ success: boolean; stats: TeacherStats }>('/teacher/stats/stats');
  }
};

export const teacherStudentsApi = {
  getAll: async () => {
    return teacherApiRequest<{ success: boolean; students: TeacherStudent[] }>('/teacher/students');
  },
  getById: async (id: string | number) => {
    return teacherApiRequest<{ success: boolean; student: TeacherStudent }>('/teacher/students/' + id);
  },
  delete: async (id: string) => {
    return teacherApiRequest<{ success: boolean; message: string }>('/teacher/students/' + id, {
      method: 'DELETE',
    });
  }
};

export const teacherAssignmentsApi = {
  getAll: async () => {
    return teacherApiRequest<{ success: boolean; assignments: TeacherAssignment[] }>('/teacher/assignments');
  },
  create: async (data: FormData) => {
    const token = teacherAuthStorage.getToken();
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/teacher/assignments`, {
      method: 'POST',
      headers,
      body: data
    });

    const resData = await response.json();
    if (!response.ok) throw new Error(resData.message || 'Creation failed');
    return resData;
  },
  getSubmissions: async (assignmentId: number) => {
    return teacherApiRequest<{ success: boolean; submissions: StudentSubmission[] }>(`/teacher/assignments/${assignmentId}/submissions`);
  },
  gradeSubmission: async (submissionId: number, grade: number, feedback: string) => {
    return teacherApiRequest<{ success: boolean }>(`/teacher/assignments/submissions/${submissionId}/grade`, {
      method: 'POST',
      body: JSON.stringify({ grade, feedback })
    });
  }
};

export const teacherAttendanceApi = {
  mark: async (date: string, attendance: any[]) => {
    return teacherApiRequest<{ success: boolean; message: string }>('/teacher/attendance', {
      method: 'POST',
      body: JSON.stringify({ date, attendance })
    });
  },
  getHistory: async (params?: { date?: string; student_id?: number }) => {
    let qs = '';
    if (params) {
      const parts = [];
      if (params.date) parts.push(`date=${params.date}`);
      if (params.student_id) parts.push(`student_id=${params.student_id}`);
      if (parts.length) qs = '?' + parts.join('&');
    }
    return teacherApiRequest<{ success: boolean; attendance: AttendanceRecord[] }>(`/teacher/attendance/history${qs}`);
  }
};

export const studentAdminApi = {
  list: async () => {
    return apiRequest<{ success: boolean; students: StudentUser[] }>('/admin/students');
  },
  updateStatus: async (id: string, status: 'active' | 'inactive') => {
    return apiRequest<{ success: boolean; message: string; student: StudentUser }>(`/admin/students/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },
  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/admin/students/${id}`, {
      method: 'DELETE'
    });
  }
};

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  status?: 'active' | 'inactive';
  created_at?: string;
}

export const adminUserApi = {
  list: async () => {
    return apiRequest<{ success: boolean; admins: AdminUser[] }>('/admin/users');
  },
  updateStatus: async (id: number, status: 'active' | 'inactive') => {
    return apiRequest<{ success: boolean; message: string; admin: AdminUser }>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },
  delete: async (id: number) => {
    return apiRequest<{ success: boolean; message: string }>(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  }
};

export const analyticsApi = {
  track: async (path: string) => {
    return apiRequest<{ success: boolean }>('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ path })
    });
  },
  getOverview: async () => {
    return apiRequest<{
      success: boolean;
      stats: {
        monthly_visitors: number;
        last_month_visitors: number;
        total_visitors: number;
        trend: number;
        students_total: number;
        students_online: number;
        teachers_total: number;
        teachers_online: number;
        is_table_missing?: boolean;
      }
    }>('/analytics/overview');
  }
};
