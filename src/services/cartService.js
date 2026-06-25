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

export const addToCartApi = async (productId, quantity = 1, size = null) => {
  try {
    const response = await http.post('/cart/add', { productId, quantity, size });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItemApi = async (productId, quantity, size = null) => {
  try {
    const response = await http.put('/cart/update', { productId, quantity, size });
    return response.data;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

export const removeCartItemApi = async (productId, size = null) => {
  try {
    const url = size ? `/cart/remove/${productId}?size=${encodeURIComponent(size)}` : `/cart/remove/${productId}`;
    const response = await http.delete(url);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};
