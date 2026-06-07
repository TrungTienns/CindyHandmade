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

export const addToCartApi = async (productId, quantity = 1) => {
  try {
    const response = await http.post('/cart/add', { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItemApi = async (productId, quantity) => {
  try {
    const response = await http.put('/cart/update', { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

export const removeCartItemApi = async productId => {
  try {
    const response = await http.delete(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};
