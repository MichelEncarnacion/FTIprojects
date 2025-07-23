import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL   // .env ⇒ VITE_API_URL=http://localhost:8000
});

/* Adjunta el token automáticamente a cada request */
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      logout();
      window.location.href = "/login";
    }
    throw err;
  }
);


export default api;
