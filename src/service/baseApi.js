import axios from 'axios';
import { getToken, tokenIsPresent,getCurrentUser } from './AuthService';

const api = axios.create({
    baseURL: 'http://localhost:8092/bookingApp/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
});

api.interceptors.request.use(request => {
    const isLoggedIn = getCurrentUser() !== null;
    if (isLoggedIn) {
        request.headers.common.Authorization = `Bearer ${getToken()}`;
    }
    return request;
});


export default api;