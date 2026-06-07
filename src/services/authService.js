import http from './http';

export const loginApi = async (email, password) => {
  try {
    const response = await http.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const registerApi = async (name, email, password) => {
  try {
    const response = await http.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
