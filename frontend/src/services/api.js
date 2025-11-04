import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (userData) => api.post("/auth/login", userData),
  getMe: () => api.get("/auth/me"),
};

export const taskAPI = {
  getTasks: (params) => api.get("/tasks", { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post("/tasks", taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  toggleFavorite: (id) => api.patch(`/tasks/${id}/favorite`),
  bulkDelete: (taskIds) => api.post("/tasks/bulk-delete", { taskIds }),
  getStats: () => api.get("/tasks/stats"),
};

export default api;
