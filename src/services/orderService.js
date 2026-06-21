import http from './http';

export const fetchOrders = async () => {
  try {
    const response = await http.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const fetchMyOrders = async () => {
  try {
    const response = await http.get('/orders/myorders');
    return response.data;
  } catch (error) {
    console.error('Error fetching my orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await http.put(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order status for ${id}:`, error);
    throw error;
  }
};
