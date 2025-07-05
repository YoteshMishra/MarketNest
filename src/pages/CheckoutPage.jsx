import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CheckCircleIcon,
  TruckIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  PlusIcon,
  ArrowLeftIcon,
  LockClosedIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

import { createOrder } from '../store/slices/ordersSlice';
import { clearCart } from '../store/slices/cartSlice';
import { ordersAPI } from '../services/api';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const {
    items,
    totalAmount,
    totalQuantity,
    discountAmount = 0,
    discountCode,
    finalAmount = totalAmount - discountAmount
  } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading: orderLoading } = useSelector((state) => state.orders);

  // Checkout steps
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    isDefault: false
  });

  const [billingAddress, setBillingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    sameAsShipping: true
  });

  const [paymentMethod, setPaymentMethod] = useState({
    type: 'credit_card', // credit_card, debit_card, paypal, apple_pay, google_pay
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    saveCard: false
  });

  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Form validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Load user's default address if available
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
      setShippingAddress(prev => ({
        ...prev,
        name: defaultAddress.name || user.name,
        street: defaultAddress.street,
        apartment: defaultAddress.apartment || '',
        city: defaultAddress.city,
        state: defaultAddress.state,
        zipCode: defaultAddress.zipCode,
        country: defaultAddress.country || 'USA'
      }));
    }
  }, [user]);

  // Redirect if cart is empty or user not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, items.length, navigate]);

  // Calculate totals
  const shippingCost = finalAmount >= 50 ? 0 : 9.99;
  const tax = finalAmount * 0.08; // 8% tax
  const orderTotal = finalAmount + shippingCost + tax;

  // Steps configuration
  const steps = [
    { id: 1, name: 'Shipping', icon: TruckIcon },
    { id: 2, name: 'Payment', icon: CreditCardIcon },
    { id: 3, name: 'Review', icon: CheckCircleIcon }
  ];

  // Validation functions
  const validateShippingAddress = () => {
    const newErrors = {};

    if (!shippingAddress.name.trim()) newErrors.name = 'Name is required';
    if (!shippingAddress.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) newErrors.email = 'Email is invalid';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shippingAddress.street.trim()) newErrors.street = 'Street address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentMethod = () => {
    const newErrors = {};

    if (paymentMethod.type === 'credit_card' || paymentMethod.type === 'debit_card') {
      if (!paymentMethod.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      else if (paymentMethod.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Card number is invalid';

      if (!paymentMethod.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(paymentMethod.expiryDate)) newErrors.expiryDate = 'Expiry date format is invalid (MM/YY)';

      if (!paymentMethod.cvv.trim()) newErrors.cvv = 'CVV is required';
      else if (paymentMethod.cvv.length < 3) newErrors.cvv = 'CVV is invalid';

      if (!paymentMethod.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler functions
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateShippingAddress()) {
        setCompletedSteps(prev => [...prev, 1]);
        setCurrentStep(2);
      } else {
        toast.error('Please fill in all required shipping information');
      }
    } else if (currentStep === 2) {
      if (validatePaymentMethod()) {
        setCompletedSteps(prev => [...prev, 2]);
        setCurrentStep(3);
      } else {
        toast.error('Please fill in all required payment information');
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId) => {
    if (stepId <= currentStep || completedSteps.includes(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const handleShippingAddressChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentMethodChange = (field, value) => {
    setPaymentMethod(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order data
      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: item.size,
          color: item.color
        })),
        shippingAddress,
        billingAddress: billingAddress.sameAsShipping ? shippingAddress : billingAddress,
        paymentMethod: {
          type: paymentMethod.type,
          last4: paymentMethod.cardNumber.slice(-4),
          cardholderName: paymentMethod.cardholderName
        },
        subtotal: totalAmount,
        discountAmount,
        discountCode,
        shippingCost,
        tax,
        totalAmount: orderTotal,
        orderNotes,
        status: 'pending'
      };

      // Create order via API
      const newOrder = await ordersAPI.createOrder(orderData);

      // Update Redux store
      dispatch(createOrder(newOrder));

      // Clear cart
      dispatch(clearCart());

      // Set success state
      setCreatedOrder(newOrder);
      setOrderSuccess(true);

      toast.success('Order placed successfully!');

    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleViewOrder = () => {
    if (createdOrder) {
      navigate(`/profile/orders/${createdOrder.id}`);
    }
  };

  // Don't render if cart is empty or user not authenticated
  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  // Order Success Page
  if (orderSuccess && createdOrder) {
    return (
      <div className="min-h-screen py-8 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6">
              <CheckCircleSolidIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600 text-lg">
                Thank you for your purchase. Your order has been confirmed and is being processed.
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900">#{createdOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Total</p>
                  <p className="text-lg font-semibold text-gray-900">${orderTotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {paymentMethod.type.replace('_', ' ')} ending in {paymentMethod.cardNumber.slice(-4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items ({totalQuantity} items)</h3>
              <div className="space-y-3">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 text-left">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price}</p>
                    </div>
                    <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-sm text-gray-600">+ {items.length - 3} more items</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleViewOrder}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Order Details
              </button>
              <button
                onClick={handleContinueShopping}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  <span>Order confirmation sent to {user.email}</span>
                </div>
                <div className="flex items-center justify-center">
                  <TruckIcon className="h-5 w-5 mr-2" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  <span>Secure payment processed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-1">{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your order</p>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Cart
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const isClickable = step.id <= currentStep || completedSteps.includes(step.id);

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isClickable}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : isClickable
                        ? 'border-gray-300 text-gray-500 hover:border-blue-600 hover:text-blue-600'
                        : 'border-gray-200 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircleSolidIcon className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </button>
                  <div className="ml-3 mr-8">
                    <p className={`text-sm font-medium ${
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      Step {step.id}
                    </p>
                    <p className={`text-sm ${
                      isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mr-8 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6">
                {/* Step 1: Shipping Address */}
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <TruckIcon className="h-6 w-6 text-blue-600 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                    </div>

                    <div className="space-y-6">
                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <div className="relative">
                              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                value={shippingAddress.name}
                                onChange={(e) => handleShippingAddressChange('name', e.target.value)}
                                className={`w-full pl-10 pr-3 py-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
                                  errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter your full name"
                              />
                            </div>
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <div className="relative">
                              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="email"
                                value={shippingAddress.email}
                                onChange={(e) => handleShippingAddressChange('email', e.target.value)}
                                className={`w-full pl-10 pr-3 py-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
                                  errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter your email"
                              />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <div className="relative">
                              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="tel"
                                value={shippingAddress.phone}
                                onChange={(e) => handleShippingAddressChange('phone', e.target.value)}
                                className={`w-full pl-10 pr-3 py-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
                                  errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter your phone number"
                              />
                            </div>
                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Street Address *
                            </label>
                            <div className="relative">
                              <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                value={shippingAddress.street}
                                onChange={(e) => handleShippingAddressChange('street', e.target.value)}
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.street ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter your street address"
                              />
                            </div>
                            {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Apartment, suite, etc. (optional)
                            </label>
                            <input
                              type="text"
                              value={shippingAddress.apartment}
                              onChange={(e) => handleShippingAddressChange('apartment', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Apartment, suite, unit, building, floor, etc."
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                City *
                              </label>
                              <input
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.city ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="City"
                              />
                              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                State *
                              </label>
                              <input
                                type="text"
                                value={shippingAddress.state}
                                onChange={(e) => handleShippingAddressChange('state', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.state ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="State"
                              />
                              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                ZIP Code *
                              </label>
                              <input
                                type="text"
                                value={shippingAddress.zipCode}
                                onChange={(e) => handleShippingAddressChange('zipCode', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="ZIP Code"
                              />
                              {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <select
                              value={shippingAddress.country}
                              onChange={(e) => handleShippingAddressChange('country', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="USA">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="UK">United Kingdom</option>
                              <option value="Australia">Australia</option>
                            </select>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="saveAddress"
                              checked={shippingAddress.isDefault}
                              onChange={(e) => handleShippingAddressChange('isDefault', e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="saveAddress" className="ml-2 text-sm text-gray-700">
                              Save this address as default
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <CreditCardIcon className="h-6 w-6 text-blue-600 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                    </div>

                    <div className="space-y-6">
                      {/* Payment Method Selection */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            { id: 'credit_card', name: 'Credit Card', icon: CreditCardIcon },
                            { id: 'debit_card', name: 'Debit Card', icon: CreditCardIcon },
                            { id: 'paypal', name: 'PayPal', icon: BanknotesIcon },
                            { id: 'apple_pay', name: 'Apple Pay', icon: DevicePhoneMobileIcon },
                            { id: 'google_pay', name: 'Google Pay', icon: DevicePhoneMobileIcon }
                          ].map((method) => (
                            <button
                              key={method.id}
                              onClick={() => handlePaymentMethodChange('type', method.id)}
                              className={`p-4 border-2 rounded-lg transition-colors ${
                                paymentMethod.type === method.id
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <method.icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                              <p className="text-sm font-medium text-gray-900">{method.name}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Card Details (for credit/debit cards) */}
                      {(paymentMethod.type === 'credit_card' || paymentMethod.type === 'debit_card') && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Card Details</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Card Number *
                              </label>
                              <div className="relative">
                                <CreditCardIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                  type="text"
                                  value={paymentMethod.cardNumber}
                                  onChange={(e) => handlePaymentMethodChange('cardNumber', formatCardNumber(e.target.value))}
                                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="1234 5678 9012 3456"
                                  maxLength="19"
                                />
                              </div>
                              {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Expiry Date *
                                </label>
                                <input
                                  type="text"
                                  value={paymentMethod.expiryDate}
                                  onChange={(e) => handlePaymentMethodChange('expiryDate', formatExpiryDate(e.target.value))}
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="MM/YY"
                                  maxLength="5"
                                />
                                {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  CVV *
                                </label>
                                <div className="relative">
                                  <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                  <input
                                    type="text"
                                    value={paymentMethod.cvv}
                                    onChange={(e) => handlePaymentMethodChange('cvv', e.target.value.replace(/\D/g, ''))}
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                      errors.cvv ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="123"
                                    maxLength="4"
                                  />
                                </div>
                                {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cardholder Name *
                              </label>
                              <input
                                type="text"
                                value={paymentMethod.cardholderName}
                                onChange={(e) => handlePaymentMethodChange('cardholderName', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Name as it appears on card"
                              />
                              {errors.cardholderName && <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>}
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="saveCard"
                                checked={paymentMethod.saveCard}
                                onChange={(e) => handlePaymentMethodChange('saveCard', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                                Save this card for future purchases
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Billing Address */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                        <div className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            id="sameAsShipping"
                            checked={billingAddress.sameAsShipping}
                            onChange={(e) => setBillingAddress(prev => ({ ...prev, sameAsShipping: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
                            Same as shipping address
                          </label>
                        </div>

                        {!billingAddress.sameAsShipping && (
                          <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                            <p>Billing address form would go here (simplified for demo)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>
                    </div>

                    <div className="space-y-6">
                      {/* Order Items */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                        <div className="space-y-4">
                          {items.map((item) => (
                            <div key={`${item.id}-${item.size || ''}-${item.color || ''}`} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                {(item.size || item.color) && (
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
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

                      {/* Shipping Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Contact</p>
                              <p className="text-gray-900">{shippingAddress.name}</p>
                              <p className="text-gray-900">{shippingAddress.email}</p>
                              <p className="text-gray-900">{shippingAddress.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Address</p>
                              <p className="text-gray-900">{shippingAddress.street}</p>
                              {shippingAddress.apartment && <p className="text-gray-900">{shippingAddress.apartment}</p>}
                              <p className="text-gray-900">
                                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                              </p>
                              <p className="text-gray-900">{shippingAddress.country}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CreditCardIcon className="h-6 w-6 text-gray-600" />
                            <div>
                              <p className="font-medium text-gray-900 capitalize">
                                {paymentMethod.type.replace('_', ' ')}
                              </p>
                              {(paymentMethod.type === 'credit_card' || paymentMethod.type === 'debit_card') && (
                                <p className="text-sm text-gray-600">
                                  **** **** **** {paymentMethod.cardNumber.slice(-4)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Notes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Order Notes (Optional)
                        </label>
                        <textarea
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Any special instructions for your order..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
                  <button
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {currentStep < 3 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size || ''}-${item.color || ''}`} className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        {(item.size || item.color) && (
                          <p className="text-xs text-gray-600">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ', '}
                            {item.color && `Color: ${item.color}`}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 border-t border-gray-200 pt-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discountCode})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="space-y-3 text-sm text-gray-600 border-t border-gray-200 pt-6">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-4 w-4 mr-2 text-green-600" />
                    <span>SSL encrypted checkout</span>
                  </div>
                  <div className="flex items-center">
                    <TruckIcon className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-center">
                    <LockClosedIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span>Your payment info is secure</span>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TruckIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">
                      Estimated Delivery
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
