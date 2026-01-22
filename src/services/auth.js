import api from './api';

export const feiranteRegister = (data) => api.post('/api/auth/register', data);
export const feiranteLogin = (data) => api.post('/api/auth/login', data);
