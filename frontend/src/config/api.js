export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  RIDES: {
    CREATE: `${API_BASE_URL}/rides`,
    LIST: `${API_BASE_URL}/rides`,
    SEARCH: `${API_BASE_URL}/rides/search`,
  },
};
