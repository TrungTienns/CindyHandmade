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

export const fetchCategories = async () => {
  try {
    const response = await http.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    // productData có thể là FormData (khi có upload ảnh) hoặc JSON (khi không có ảnh)
    // Axios sẽ tự động set đúng Content-Type nếu là FormData
    const response = await http.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await http.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};
