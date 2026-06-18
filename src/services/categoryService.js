import http from './http';

export const fetchCategories = async () => {
  try {
    const response = await http.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await http.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await http.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await http.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
};
