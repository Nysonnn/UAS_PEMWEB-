export const API_BASE_URL = 'http://localhost:8080/api';

export const api = window.axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      alert('Sesi Anda berakhir. Silakan login kembali.');
      window.location.hash = '#/login';
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return 'Aplikasi belum terhubung ke server. Coba beberapa saat lagi.';
  if (typeof data.message === 'string') return data.message;
  if (typeof data.messages === 'object') return Object.values(data.messages).join(', ');
  return 'Request gagal diproses.';
}
