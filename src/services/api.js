import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://backend-mercado-cidade.vercel.app/',
});


export const getProdutos = () => api.get('/api/products');
export const getCategorias = () => api.get('/api/categorias');
export const getBoxes = () => api.get('/api/boxes');
export const gerarRoteiro = (produtos) => api.post('/api/shopping-list', { produtos });

export default api;
