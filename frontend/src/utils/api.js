const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  try {
    const url = `${API_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const options = {
      method,
      headers: {}
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      if (isFormData) {
        options.body = body; // Multer upload body (multipart/form-data)
      } else {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }
    }

    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error(`API Call Error (${endpoint}):`, error.message);
    throw error;
  }
};
