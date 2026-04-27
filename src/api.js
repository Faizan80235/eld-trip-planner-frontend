import axios from 'axios';

const API_BASE_URL = 'https://eld-trip-planner-backend-eosin.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const calculateRoute = async (tripData) => {
  const response = await api.post('/api/calculate-route/', tripData);
  return response.data;
};

export default api;