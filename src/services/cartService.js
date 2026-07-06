import http from './http';

export const getCartApi = async () => {
  try {
    const response = await http.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCartApi = async (productId, quantity = 1, size = null, color = null) => {
  try {
    const response = await http.post('/cart/add', { productId, quantity, size, color });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItemApi = async (productId, quantity, size = null, color = null) => {
  try {
    const response = await http.put('/cart/update', { productId, quantity, size, color });
    return response.data;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

export const removeCartItemApi = async (productId, size = null, color = null) => {
  try {
    const queryParams = new URLSearchParams();
    if (size) queryParams.append('size', size);
    if (color) queryParams.append('color', color);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/cart/remove/${productId}?${queryString}` : `/cart/remove/${productId}`;
    const response = await http.delete(url);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};
