import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const AdminAnalyticsPage = () => {
  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.orders);
  
  const [timeRange, setTimeRange] = useState('30days');
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 4, // Mock data
    revenueGrowth: 0,
    ordersGrowth: 0,
    topProducts: [],
    recentOrders: [],
    salesByCategory: [],
    monthlyRevenue: []
  });

  useEffect(() => {
    calculateAnalytics();
  }, [products, orders, timeRange]);

  const calculateAnalytics = () => {
    const allOrders = Object.values(orders.userOrders || {}).flat();
    
    // Filter orders by time range
    const now = new Date();
    const filteredOrders = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const diffTime = Math.abs(now - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (timeRange) {
        case '7days': return diffDays <= 7;
        case '30days': return diffDays <= 30;
        case '90days': return diffDays <= 90;
        case '1year': return diffDays <= 365;
        default: return true;
      }
    });

    // Calculate basic metrics
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = filteredOrders.length;

    // Calculate growth (mock data for demonstration)
    const revenueGrowth = Math.floor(Math.random() * 30) + 5; // 5-35% growth
    const ordersGrowth = Math.floor(Math.random() * 25) + 3; // 3-28% growth

    // Get top products by sales
    const productSales = {};
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        if (productSales[item.id]) {
          productSales[item.id].quantity += item.quantity;
          productSales[item.id].revenue += item.price * item.quantity;
        } else {
          productSales[item.id] = {
            ...item,
            quantity: item.quantity,
            revenue: item.price * item.quantity
          };
        }
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get recent orders
    const recentOrders = allOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    // Calculate sales by category
    const categorySales = {};
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const category = product?.category || 'Unknown';
        categorySales[category] = (categorySales[category] || 0) + (item.price * item.quantity);
      });
    });

    const salesByCategory = Object.entries(categorySales)
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    // Generate monthly revenue data (mock data)
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(now.getFullYear(), i, 1).toLocaleString('default', { month: 'short' });
      const revenue = Math.floor(Math.random() * 50000) + 10000; // $10k-$60k per month
      return { month, revenue };
    });

    setAnalytics({
      totalRevenue,
      totalOrders,
      totalProducts: products.length,
      totalUsers: 4, // Mock data
      revenueGrowth,
      ordersGrowth,
      topProducts,
      recentOrders,
      salesByCategory,
      monthlyRevenue
    });
  };

  const StatCard = ({ title, value, icon: Icon, growth, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {growth !== undefined && (
            <div className="flex items-center mt-1">
              {growth >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(growth)}% from last period
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toFixed(2)}`}
          icon={CurrencyDollarIcon}
          growth={analytics.revenueGrowth}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={analytics.totalOrders}
          icon={ShoppingBagIcon}
          growth={analytics.ordersGrowth}
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={analytics.totalProducts}
          icon={ChartBarIcon}
          color="purple"
        />
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={UsersIcon}
          color="indigo"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Products by Revenue</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.topProducts.length > 0 ? (
                analytics.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-xs">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.quantity} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${product.revenue.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">#{index + 1}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-4">No sales data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.salesByCategory.length > 0 ? (
                analytics.salesByCategory.map((category, index) => {
                  const percentage = analytics.totalRevenue > 0 
                    ? (category.revenue / analytics.totalRevenue * 100).toFixed(1)
                    : 0;
                  return (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-${['blue', 'green', 'purple', 'yellow', 'red', 'indigo'][index % 6]}-500`}></div>
                        <span className="font-medium text-gray-900 capitalize">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${category.revenue.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{percentage}%</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-600 text-center py-4">No category data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Orders
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.recentOrders.length > 0 ? (
                analytics.recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.shippingAddress?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-700">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recent orders</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
