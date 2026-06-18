import http from './http';

export const fetchUsers = async () => {
  try {
    const response = await http.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const response = await http.put(`/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    console.error(`Error updating role for user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await http.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};
