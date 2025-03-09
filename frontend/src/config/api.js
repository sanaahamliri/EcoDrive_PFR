export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me'
  },
  RIDES: {
    BASE: '/api/v1/rides',
    BOOK: (id) => `/api/v1/rides/${id}/book`,
    CANCEL: (id) => `/api/v1/rides/${id}/book`
  },
  USERS: {
    PROFILE: '/api/v1/users/me',
    TRIPS: '/api/v1/users/me/trips',
    PREFERENCES: '/api/v1/users/me/preferences',
    PHOTO: '/api/v1/users/me/photo',
    PUBLIC: (id) => `/api/v1/users/${id}`
  },
  REVIEWS: {
    BASE: '/api/v1/reviews'
  }
}; 