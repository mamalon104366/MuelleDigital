import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

// Adjunta el token JWT (si existe) en cada petición.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normaliza el mensaje de error que devuelve la API.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg = error.response?.data?.error || error.message || 'Error de conexión.';
    return Promise.reject(new Error(msg));
  }
);

export default api;
