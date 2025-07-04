import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { OrderCardSkeleton } from '../../components/common/LoadingSkeleton';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { orders, loading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Get user's orders
  const userOrders = orders.filter(order => order.userId === user?.id);

  // Filter orders based on search and filters
  const filteredOrders = userOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    const matchesDate = dateFilter === 'all' || (() => {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case '7days': return diffDays <= 7;
        case '30days': return diffDays <= 30;
        case '90days': return diffDays <= 90;
        default: return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort orders by date (newest first)
  const sortedOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Order status configuration
  const orderStatuses = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800',
      icon: ClockIcon,
      description: 'Order is being processed'
    },
    confirmed: {
      label: 'Confirmed',
      color: 'bg-blue-100 text-blue-800',
      icon: CheckCircleIcon,
      description: 'Order has been confirmed'
    },
    shipped: {
      label: 'Shipped',
      color: 'bg-purple-100 text-purple-800',
      icon: TruckIcon,
      description: 'Order is on the way'
    },
    delivered: {
      label: 'Delivered',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircleSolidIcon,
      description: 'Order has been delivered'
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800',
      icon: XCircleIcon,
      description: 'Order has been cancelled'
    },
    returned: {
      label: 'Returned',
      color: 'bg-gray-100 text-gray-800',
      icon: ArrowPathIcon,
      description: 'Order has been returned'
    }
  };

  // Load specific order if orderId is provided
  useEffect(() => {
    if (orderId) {
      const order = userOrders.find(o => o.id === orderId);
      setSelectedOrder(order);
    }
  }, [orderId, userOrders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderTotal = (order) => {
    return order.totalAmount || (order.subtotal + (order.shippingCost || 0) + (order.tax || 0) - (order.discountAmount || 0));
  };

  const getEstimatedDelivery = (order) => {
    const orderDate = new Date(order.createdAt);
    const estimatedDate = new Date(orderDate.getTime() + (5 * 24 * 60 * 60 * 1000)); // 5 days
    return estimatedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Order Detail View
  if (selectedOrder) {
    const status = orderStatuses[selectedOrder.status];
    const StatusIcon = status.icon;

    return (
      <div className="min-h-screen py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                to="/orders"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Orders
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Order #{selectedOrder.id}</h1>
              <p className="text-gray-600 mt-1">Placed on {formatDate(selectedOrder.createdAt)}</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {status.label}
              </div>
              <p className="text-sm text-gray-600 mt-1">{status.description}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          {(item.size || item.color) && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                          )}
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
                      <div className="text-gray-900">
                        <p>{selectedOrder.shippingAddress?.name}</p>
                        <p>{selectedOrder.shippingAddress?.street}</p>
                        {selectedOrder.shippingAddress?.apartment && (
                          <p>{selectedOrder.shippingAddress.apartment}</p>
                        )}
                        <p>
                          {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                        </p>
                        <p>{selectedOrder.shippingAddress?.country}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                      <div className="text-gray-900">
                        <p>{selectedOrder.shippingAddress?.email}</p>
                        <p>{selectedOrder.shippingAddress?.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Timeline</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircleSolidIcon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Order Placed</p>
                        <p className="text-sm text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                    </div>

                    {selectedOrder.status !== 'pending' && (
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircleSolidIcon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order Confirmed</p>
                          <p className="text-sm text-gray-600">Your order has been confirmed and is being prepared</p>
                        </div>
                      </div>
                    )}

                    {(selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered') && (
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                            <TruckIcon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order Shipped</p>
                          <p className="text-sm text-gray-600">Your order is on the way</p>
                          {selectedOrder.trackingNumber && (
                            <p className="text-sm text-blue-600">Tracking: {selectedOrder.trackingNumber}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedOrder.status === 'delivered' && (
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircleSolidIcon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order Delivered</p>
                          <p className="text-sm text-gray-600">Your order has been delivered successfully</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
                    </div>

                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${selectedOrder.discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>${selectedOrder.shippingCost?.toFixed(2) || '0.00'}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${selectedOrder.tax?.toFixed(2) || '0.00'}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-semibold text-gray-900">
                        <span>Total</span>
                        <span>${getOrderTotal(selectedOrder).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h3>
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900 capitalize">
                        {selectedOrder.paymentMethod?.type?.replace('_', ' ')}
                        {selectedOrder.paymentMethod?.last4 && ` ending in ${selectedOrder.paymentMethod.last4}`}
                      </span>
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Estimated Delivery</h3>
                      <p className="text-gray-900">{getEstimatedDelivery(selectedOrder)}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {selectedOrder.status === 'delivered' && (
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Leave Review
                      </button>
                    )}

                    {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                      <button className="w-full border border-red-300 text-red-700 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors">
                        Cancel Order
                      </button>
                    )}

                    <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Orders List View
  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">
              {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'} found
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <OrderCardSkeleton key={index} />
            ))}
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {userOrders.length === 0 ? 'No orders yet' : 'No orders found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {userOrders.length === 0
                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {userOrders.length === 0 && (
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {sortedOrders.map((order) => {
              const status = orderStatuses[order.status];
              const StatusIcon = status.icon;
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                          <StatusIcon className="h-4 w-4 mr-2" />
                          {status.label}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ${getOrderTotal(order).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              +{order.items.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">
                          {order.items[0]?.name}
                          {order.items.length > 1 && ` and ${order.items.length - 1} more items`}
                        </p>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <p className="text-sm text-gray-600">
                            Estimated delivery: {getEstimatedDelivery(order)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        {order.trackingNumber && (
                          <span className="text-sm text-blue-600">
                            Tracking: {order.trackingNumber}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View Details
                        </Link>

                        {order.status === 'delivered' && (
                          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Leave Review
                          </button>
                        )}

                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
