import http from './http';

export const fetchMonthlyRevenue = async () => {
  try {
    const response = await http.get('/dashboard/revenue/monthly');
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    throw error;
  }
};

export const fetchYearlyRevenue = async () => {
  try {
    const response = await http.get('/dashboard/revenue/yearly');
    return response.data;
  } catch (error) {
    console.error('Error fetching yearly revenue:', error);
    throw error;
  }
};
