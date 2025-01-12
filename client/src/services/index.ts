import axios, { AxiosInstance } from 'axios';

const baseURL = `${import.meta.env.VITE_API_BASE_URL}/v1`;

const api: AxiosInstance = axios.create({
  baseURL
});

export default api;
