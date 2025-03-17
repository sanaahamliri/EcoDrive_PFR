export const ENDPOINTS = {
  RIDES: {
    SEARCH: '/api/v1/rides',
    GET: (id) => `/api/v1/rides/${id}`,
    BOOK: (id) => `/api/v1/rides/${id}/book`,
    CANCEL: (id) => `/api/v1/rides/${id}/book`,
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  }
}; 