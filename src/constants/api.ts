import ky from 'ky';

const API_BASE_URL = 'http://localhost:3000';

const api = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: 'include',
});

export default api;