import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = (error.config && error.config.url) || '';
    const isLoginRequest = url.includes('/auth/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      // A 401 on the login endpoint is handled by the login page itself
      // (it shows "Invalid email or password"). We only auto-redirect for
      // other, authenticated requests so staff and admin don't bounce each
      // other around.
      let role = null;
      try {
        const storedUser = localStorage.getItem('user');
        role = storedUser ? JSON.parse(storedUser).role : null;
      } catch (e) {
        // ignore
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = role === 'admin' ? '/admin/login' : '/staff/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me')
};

export const trainAPI = {
  getAll: () => api.get('/trains'),
  getOne: (id) => api.get(`/trains/${id}`),
  create: (data) => api.post('/trains', data),
  update: (id, data) => api.put(`/trains/${id}`, data),
  delete: (id) => api.delete(`/trains/${id}`)
};

export const coachAPI = {
  getAll: (trainId) => api.get('/coaches', { params: { trainId } }),
  getOne: (id) => api.get(`/coaches/${id}`),
  create: (data) => api.post('/coaches', data),
  update: (id, data) => api.put(`/coaches/${id}`, data),
  delete: (id) => api.delete(`/coaches/${id}`)
};

export const seatAPI = {
  getAll: (coachId) => api.get('/seats', { params: { coachId } }),
  getOne: (id) => api.get(`/seats/${id}`),
  getByQrId: (qrId) => api.get(`/seats/qr/${qrId}`),
  create: (data) => api.post('/seats', data),
  update: (id, data) => api.put(`/seats/${id}`, data),
  delete: (id) => api.delete(`/seats/${id}`)
};

export const requestAPI = {
  create: (data) => api.post('/requests', data),
  createEmergency: (data) => api.post('/requests/emergency', data),
  getAll: (params) => api.get('/requests', { params }),
  getOne: (id) => api.get(`/requests/${id}`),
  updateStatus: (id, status) => api.put(`/requests/${id}`, { status }),
  getByQrId: (qrId) => api.get(`/requests/qr/${qrId}`)
};

export const staffAPI = {
  getAll: () => api.get('/staff'),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`)
};

export default api;
