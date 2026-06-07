import http from './http';

export const fetchProducts = async () => {
  try {
    const response = await http.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async id => {
  try {
    const response = await http.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
  }
};
