import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  MagnifyingGlassIcon, 
  TruckIcon, 
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { orders } = useSelector((state) => state.orders);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundOrder = orders.find(order => 
        order.id.toLowerCase().includes(orderNumber.toLowerCase()) ||
        order.orderNumber?.toLowerCase().includes(orderNumber.toLowerCase())
      );
      
      setTrackedOrder(foundOrder || null);
      setIsLoading(false);
    }, 1000);
  };

  const getOrderStatus = (status) => {
    const statusConfig = {
      'pending': { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: ClockIcon },
      'processing': { color: 'text-blue-600', bg: 'bg-blue-100', icon: TruckIcon },
      'shipped': { color: 'text-purple-600', bg: 'bg-purple-100', icon: TruckIcon },
      'delivered': { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircleIcon },
      'cancelled': { color: 'text-red-600', bg: 'bg-red-100', icon: ClockIcon }
    };
    return statusConfig[status] || statusConfig['pending'];
  };

  const trackingSteps = [
    { id: 1, title: 'Order Confirmed', description: 'Your order has been placed successfully' },
    { id: 2, title: 'Processing', description: 'We are preparing your order' },
    { id: 3, title: 'Shipped', description: 'Your order is on the way' },
    { id: 4, title: 'Delivered', description: 'Order delivered successfully' }
  ];

  const getStepStatus = (stepId, orderStatus) => {
    const statusMap = {
      'pending': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4
    };
    const currentStep = statusMap[orderStatus] || 1;
    
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number to track your package</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleTrackOrder} className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter your order number (e.g., ORD-001)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <MagnifyingGlassIcon className="h-5 w-5" />
                )}
                Track Order
              </button>
            </div>
          </form>
        </div>

        {/* Order Results */}
        {trackedOrder && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order #{trackedOrder.id}</h2>
                <p className="text-gray-600">Placed on {new Date(trackedOrder.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatus(trackedOrder.status).bg} ${getOrderStatus(trackedOrder.status).color}`}>
                {trackedOrder.status.charAt(0).toUpperCase() + trackedOrder.status.slice(1)}
              </div>
            </div>

            {/* Tracking Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {trackingSteps.map((step, index) => {
                  const status = getStepStatus(step.id, trackedOrder.status);
                  return (
                    <div key={step.id} className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        status === 'completed' ? 'bg-green-500 text-white' :
                        status === 'current' ? 'bg-blue-500 text-white' :
                        'bg-gray-200 text-gray-400'
                      }`}>
                        {status === 'completed' ? (
                          <CheckCircleIcon className="h-6 w-6" />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-medium ${
                          status === 'completed' || status === 'current' ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div className={`absolute h-0.5 w-full top-5 left-1/2 transform -translate-y-1/2 ${
                          status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                        }`} style={{ zIndex: -1 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <div className="text-gray-600 text-sm">
                    <p>{trackedOrder.shippingAddress?.name}</p>
                    <p>{trackedOrder.shippingAddress?.address}</p>
                    <p>{trackedOrder.shippingAddress?.city}, {trackedOrder.shippingAddress?.state} {trackedOrder.shippingAddress?.zipCode}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                  <div className="text-gray-600 text-sm">
                    <p>Items: {trackedOrder.items?.length || 0}</p>
                    <p>Total: ${trackedOrder.total?.toFixed(2)}</p>
                    <p>Payment: {trackedOrder.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Order Found */}
        {orderNumber && trackedOrder === null && !isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-gray-400 mb-4">
              <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
            <p className="text-gray-600">
              We couldn't find an order with that number. Please check your order number and try again.
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Can't find your order?</h4>
                <p className="text-sm text-gray-600">Check your email for the order confirmation with tracking details.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TruckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Delivery Questions?</h4>
                <p className="text-sm text-gray-600">Contact our support team for delivery updates and assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
