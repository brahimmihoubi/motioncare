import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use the local network IP so physical devices on the same Wi-Fi can reach the backend
export const API_URL = 'http://172.16.3.204:5000/api';

const getBaseUrl = () => {
  // 10.0.2.2 works for Android Emulator, but real IP works for both physical devices and emulators
  return API_URL;
};

export const api = axios.create({
  baseURL: getBaseUrl(),
});

// Add a request interceptor to append the auth token
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('mc_doctor_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error retrieving token from AsyncStorage', error);
  }
  return config;
});

// Add a response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('mc_doctor_refresh_token');
        if (refreshToken) {
          // Backend expects { refreshToken } and returns { accessToken, refreshToken }
          const res = await axios.post(`${getBaseUrl()}/auth/refresh`, { refreshToken });
          const newAccessToken = res.data?.data?.accessToken;
          const newRefreshToken = res.data?.data?.refreshToken;
          if (newAccessToken) {
            await AsyncStorage.setItem('mc_doctor_token', newAccessToken);
            if (newRefreshToken) {
              await AsyncStorage.setItem('mc_doctor_refresh_token', newRefreshToken);
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, logout
        await AsyncStorage.removeItem('mc_doctor_token');
        await AsyncStorage.removeItem('mc_doctor_refresh_token');
        await AsyncStorage.removeItem('mc_doctor_profile');
        if (typeof onUnauthorized === 'function') {
          onUnauthorized();
        }
      }
    }
    return Promise.reject(error);
  }
);

// Global callback to be set by App.tsx when auth is established
let onUnauthorized: (() => void) | null = null;
export const setOnUnauthorized = (cb: () => void) => {
  onUnauthorized = cb;
};

// Auth Services
export const AuthService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/doctor/login', credentials);
    const { token, refreshToken, user } = response.data.data || {};
    if (token) {
      await AsyncStorage.setItem('mc_doctor_token', token);
      if (refreshToken) {
        await AsyncStorage.setItem('mc_doctor_refresh_token', refreshToken);
      }
      if (user) {
        await AsyncStorage.setItem('mc_doctor_profile', JSON.stringify(user));
      }
    }
    return response.data;
  },
  register: async (data: { name: string; email: string; password: string; specialization?: string }) => {
    const response = await api.post('/auth/doctor/register', data);
    return response.data;
  },
  logout: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('mc_doctor_refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout', { token: refreshToken });
      }
    } catch(e) {}
    await AsyncStorage.removeItem('mc_doctor_token');
    await AsyncStorage.removeItem('mc_doctor_refresh_token');
    await AsyncStorage.removeItem('mc_doctor_profile');
  },
  getToken: async () => {
    return await AsyncStorage.getItem('mc_doctor_token');
  }
};

export const DataService = {
  getPatients: async () => {
    const response = await api.get('/patients');
    return response.data;
  },
  createPatient: async (patientData: any) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  getProgressStats: async () => {
    const response = await api.get('/dashboard/progress');
    return response.data;
  },
  getPrograms: async () => {
    const response = await api.get('/programs/my');
    return response.data;
  },
  createProgram: async (programData: any) => {
    const response = await api.post('/programs', programData);
    return response.data;
  },
  getRecentSessions: async (limit = 10) => {
    const response = await api.get(`/sessions/my?limit=${limit}`);
    return response.data;
  },
  createSession: async (sessionData: any) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },
  getSessionById: async (id: number) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },
  getWeeklyStats: async () => {
    return { data: [] }; // Mock for now
  },
  getExercises: async () => {
    const response = await api.get('/exercises');
    return response.data;
  },
  getPatientById: async (id: number) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  getProgramsByPatient: async (patientId: number) => {
    const response = await api.get(`/programs/patient/${patientId}`);
    return response.data;
  },
  getActiveProgramByPatient: async (patientId: number) => {
    const response = await api.get(`/programs/active/${patientId}`);
    return response.data;
  },
  getProgramById: async (id: number) => {
    const response = await api.get(`/programs/${id}`);
    return response.data;
  },
  updateProgram: async (id: number, data: { name?: string; active?: boolean; exercises?: any[] }) => {
    const response = await api.put(`/programs/${id}`, data);
    return response.data;
  }
};

// Exercise Request Services
export const ExerciseRequestService = {
  getMyRequests: async () => {
    const response = await api.get('/exercise-requests/my');
    return response.data;
  },
  submitRequest: async (data: { name: string, description: string, reference_link?: string }) => {
    const response = await api.post('/exercise-requests', data);
    return response.data;
  }
};

// Exoskeleton Control Services
export const ExoskeletonService = {
  getSessionState: async (sessionId: number) => {
    const response = await api.get(`/exoskeleton/session/${sessionId}/state`);
    return response.data;
  },
  startCountdown: async (sessionId: number) => {
    const response = await api.post(`/exoskeleton/session/${sessionId}/countdown`);
    return response.data;
  },
  pauseSession: async (sessionId: number) => {
    const response = await api.post(`/exoskeleton/session/${sessionId}/pause`);
    return response.data;
  },
  resumeSession: async (sessionId: number) => {
    const response = await api.post(`/exoskeleton/session/${sessionId}/resume`);
    return response.data;
  },
  stopSession: async (sessionId: number) => {
    const response = await api.post(`/exoskeleton/session/${sessionId}/stop`);
    return response.data;
  },
  emergencyStop: async (sessionId: number) => {
    const response = await api.post(`/exoskeleton/session/${sessionId}/emergency-stop`);
    return response.data;
  }
};
