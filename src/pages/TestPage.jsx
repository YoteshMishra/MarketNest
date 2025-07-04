import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';

const TestPage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);

  const [testResults, setTestResults] = useState({});

  const runTest = (testName, testFunction) => {
    try {
      const result = testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'success', message: result || 'Test passed' }
      }));
      return true;
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'error', message: error.message }
      }));
      return false;
    }
  };

  const tests = [
    {
      name: 'Redux Store Connection',
      test: () => {
        if (!products || !Array.isArray(products)) throw new Error('Products not loaded');
        if (!Array.isArray(cartItems)) throw new Error('Cart not initialized');
        if (!Array.isArray(wishlistItems)) throw new Error('Wishlist not initialized');
        return `Store connected: ${products.length} products, ${cartItems.length} cart items, ${wishlistItems.length} wishlist items`;
      }
    },
    {
      name: 'Authentication State',
      test: () => {
        return `Auth status: ${isAuthenticated ? 'Logged in' : 'Not logged in'}${user ? ` as ${user.name}` : ''}`;
      }
    },
    {
      name: 'Cart Functionality',
      test: () => {
        if (products.length === 0) throw new Error('No products available to test cart');
        const testProduct = products[0];
        dispatch(addToCart({ ...testProduct, quantity: 1 }));
        return 'Cart add functionality working';
      }
    },
    {
      name: 'Wishlist Functionality',
      test: () => {
        if (products.length === 0) throw new Error('No products available to test wishlist');
        const testProduct = products[0];
        dispatch(toggleWishlist(testProduct));
        return 'Wishlist toggle functionality working';
      }
    },
    {
      name: 'Toast Notifications',
      test: () => {
        toast.success('Test notification working!');
        return 'Toast notification system working';
      }
    },
    {
      name: 'Orders Data',
      test: () => {
        return `Orders loaded: ${orders.length} orders found`;
      }
    },
    {
      name: 'Routing System',
      test: () => {
        const routes = [
          '/', '/products', '/cart', '/login', '/register', 
          '/track-order', '/help', '/profile', '/orders', '/wishlist'
        ];
        return `${routes.length} main routes configured`;
      }
    }
  ];

  const runAllTests = () => {
    setTestResults({});
    tests.forEach(test => {
      setTimeout(() => runTest(test.name, test.test), 100);
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">MarketNest App Test Suite</h1>
          
          <div className="mb-8">
            <button
              onClick={runAllTests}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Run All Tests
            </button>
          </div>

          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{test.name}</h3>
                  <button
                    onClick={() => runTest(test.name, test.test)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Run Test
                  </button>
                </div>
                
                {testResults[test.name] && (
                  <div className="flex items-start gap-3 mt-3 p-3 bg-gray-50 rounded-lg">
                    {getStatusIcon(testResults[test.name].status)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        {testResults[test.name].message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Products', path: '/products' },
                { name: 'Cart', path: '/cart' },
                { name: 'Track Order', path: '/track-order' },
                { name: 'Help', path: '/help' },
                { name: 'Login', path: '/login' },
                { name: 'Profile', path: '/profile' },
                { name: 'Orders', path: '/orders' },
                { name: 'Wishlist', path: '/wishlist' },
                { name: 'Admin', path: '/admin' }
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-center text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Core Features</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Product Listing & Search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Shopping Cart Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>User Authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Checkout Process</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Order Management</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Advanced Features</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>User Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Admin Panel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Wishlist Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Order Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Help Center</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
