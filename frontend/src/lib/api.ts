import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001'
});

api.interceptors.request.use((config) => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

    if (userId) {
        config.headers['x-user-id'] = userId;
    }

    return config;
})

export default api;