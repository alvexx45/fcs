import axios from 'axios';

const api = axios.create({
  baseURL: '/', // Proxied by Vite in dev, same origin in prod
});

export default api;
