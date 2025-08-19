import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
        config.headers['x-user-id'] = user.id;
    }
    return config;
});


export const todoAPI = {
    getAll: (userId) => api.get(`/todos${userId ? `?user_id=${userId}` : ''}`),
    getById: (id) => api.get(`/todos/${id}`),
    create: (todo) => api.post('/todos', todo),
    update: (id, todo) => api.put(`/todos/${id}`, todo),
    delete: (id) => api.delete(`/todos/${id}`),
};

export const authAPI = {
    login: (username, password) =>
        api.post('/auth/login', { username, password }),
    register: (username, email, password) =>
        api.post('/auth/register', { username, email, password }),
};
