export const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  DEFAULT_PRICE_RANGE: [0, 300],
  PREFERENCES: {
    SMOKING: 'smoking',
    MUSIC: 'music',
    PETS: 'pets',
  }
}; 