import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { FiBox, FiList, FiDollarSign, FiShoppingCart } from 'react-icons/fi';
import { fetchProducts } from '../../services/productService';
import { fetchCategories } from '../../services/categoryService';
import { fetchMonthlyRevenue, fetchYearlyRevenue } from '../../services/dashboardService';
import './Dashboard.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [yearlyRevenue, setYearlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData, monthlyData, yearlyData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchMonthlyRevenue(),
          fetchYearlyRevenue()
        ]);
        setProducts(productsData || []);
        setCategories(categoriesData || []);
        setMonthlyRevenue(monthlyData || []);
        setYearlyRevenue(yearlyData || []);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Đang tải dữ liệu thống kê...</div>;
  }

  // --- Tính toán thống kê từ API ---
  const currentYear = new Date().getFullYear();
  const thisYearData = yearlyRevenue.find(y => y.year === currentYear) || { netRevenue: 0, totalOrders: 0 };
  
  const totalNetRevenue = thisYearData.netRevenue;
  const totalOrders = thisYearData.totalOrders;
  const totalProducts = products.length;

  // Thống kê theo danh mục cho Bar Chart
  const categoryStats = categories.map(cat => {
    const catProducts = products.filter(p => p.categoryId === cat.id);
    return {
      name: cat.name,
      count: catProducts.length,
    };
  });

  const barLabels = categoryStats.map(c => c.name);
  const countData = categoryStats.map(c => c.count);

  // --- Dữ liệu Line Chart (Doanh thu tháng) ---
  const revenueLabels = monthlyRevenue.map(r => r.yearMonth);
  const revenueData = monthlyRevenue.map(r => r.netRevenue);

  const lineChartData = {
    labels: revenueLabels,
    datasets: [
      {
        label: 'Doanh thu ròng (VND)',
        data: revenueData,
        borderColor: '#10b981', // Màu xanh lục lá
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 10, color: '#94a3b8' },
        grid: { color: '#f1f5f9', drawBorder: false },
        border: { display: false }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { display: false, drawBorder: false },
        border: { display: false }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  // --- Dữ liệu Bar Chart (Sản phẩm theo danh mục) ---
  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Sản phẩm',
        data: countData,
        backgroundColor: '#3b82f6', // Xanh biển
        borderRadius: 4,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      }
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#94a3b8' },
        border: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5, color: '#94a3b8' },
        grid: { color: '#f1f5f9', drawBorder: false },
        border: { display: false }
      },
    },
  };

  return (
    <div className="dashboard-container">
      {/* Top Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="icon-wrapper" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalNetRevenue)}
            </span>
            <div className="stat-label-row">
              <span className="stat-label">Tổng Doanh Thu ({currentYear})</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-wrapper" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <FiShoppingCart />
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalOrders}</span>
            <div className="stat-label-row">
              <span className="stat-label">Tổng Đơn Hàng ({currentYear})</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}>
            <FiBox />
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalProducts}</span>
            <div className="stat-label-row">
              <span className="stat-label">Tổng Sản Phẩm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="charts-grid">
        {/* Line Chart */}
        <div className="chart-card line-chart-card">
          <div className="chart-header">
            <div className="chart-title-group">
              <div className="chart-title-item revenue">
                <span className="dot" style={{ background: '#10b981' }}></span>
                <div className="text">
                  <strong>Doanh Thu Ròng Hàng Tháng</strong>
                  <span>Theo dõi mức tăng trưởng qua từng tháng</span>
                </div>
              </div>
            </div>
          </div>
          <div className="chart-body">
            {monthlyRevenue.length > 0 ? (
              <Line data={lineChartData} options={lineChartOptions} />
            ) : (
              <p>Chưa có dữ liệu doanh thu</p>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-card bar-chart-card">
          <div className="chart-header">
            <h3>Sản phẩm / Danh mục</h3>
          </div>
          <div className="chart-legend">
            <div className="legend-item revenue">
              <span className="dot"></span> Số lượng mẫu mã
            </div>
          </div>
          <div className="chart-body">
            {categories.length > 0 ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <p>Chưa có dữ liệu</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
