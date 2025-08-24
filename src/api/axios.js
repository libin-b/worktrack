import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },  
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('auth_token');
        if(token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    res => res,
    error => {
        if(error.response && error.response.status === 401){
            // Handle unauthorized access
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }

        return Promise.reject(error);
    }
);

export default api;