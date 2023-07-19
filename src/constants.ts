export const BASE_URL = (() => {
  switch(process.env.NODE_ENV) {
    case 'development':
      return 'http://localhost:3000';
    case 'test':
      return 'https://test.example.com';
    case 'production':
      return 'https://example.com';
    default:
      return 'http://localhost:3000';
  }
})()