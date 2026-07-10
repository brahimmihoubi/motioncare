import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use the local network IP so physical devices on the same Wi-Fi can reach the backend
export const API_URL = 'http://192.168.100.8:5000/api';

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
// If the token is stale/invalid, clear it so the app can redirect to login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear the stale token
      await AsyncStorage.removeItem('mc_doctor_token');
      await AsyncStorage.removeItem('mc_doctor_profile');
      // Notify app via a global callback if set
      if (typeof onUnauthorized === 'function') {
        onUnauthorized();
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
    // Backend returns { success: true, data: { user, token } }
    const { token, user } = response.data.data || {};
    if (token) {
      await AsyncStorage.setItem('mc_doctor_token', token);
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
    await AsyncStorage.removeItem('mc_doctor_token');
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
  // TODO: Create/Use actual doctor endpoints for these if needed, 
  // but for now we'll just mock them since we don't have global routes for them in the doctor role.
  getRecentSessions: async (limit = 10) => {
    return { data: [] }; // Mock for now until we add /sessions/recent for doctor
  },
  getWeeklyStats: async () => {
    return { data: [] }; // Mock for now until we add /dashboard/weekly-stats for doctor
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
