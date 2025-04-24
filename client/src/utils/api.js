// Helper utility for API URLs - works in both development and production
const getApiUrl = (path) => {
  // In production, the API will be at the same origin as the frontend
  // In development, we use the localhost:5000 address
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? '' 
    : 'http://localhost:5000';
  
  return `${baseUrl}${path}`;
};

export default getApiUrl;
