import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001'
});

api.interceptors.request.use((config) => {
    config.headers['x-user-id'] = '3';
    
    return config;
})

export default api;