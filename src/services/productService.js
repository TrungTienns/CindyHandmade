import http from './http';

export const fetchProducts = async () => {
  try {
    const response = await http.get('/products');
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
