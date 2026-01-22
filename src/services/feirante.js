import api from './api';

export const getMeuBox = () => api.get('/api/boxes?meu=1');
export const updateBox = (id, data) => api.put(`/api/boxes/${id}`, data);
export const getMeusProdutos = (boxId) => api.get(`/api/products?box=${boxId}`);
export const addProduto = (data) => api.post('/api/products', data);
export const updateProduto = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduto = (id) => api.delete(`/api/products/${id}`);
