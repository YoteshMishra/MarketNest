import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  HeartIcon,
  ArrowLeftIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

import {
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  applyDiscount,
  removeDiscount
} from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Redux state
  const {
    items,
    totalAmount,
    totalQuantity,
    discountAmount = 0,
    discountCode: appliedDiscountCode,
    finalAmount = totalAmount - discountAmount
  } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Mock discount codes for demo
  const validDiscountCodes = {
    'SAVE10': { discount: 10, type: 'percentage', description: '10% off your order' },
    'WELCOME20': { discount: 20, type: 'fixed', description: '$20 off your first order' },
    'FREESHIP': { discount: 0, type: 'shipping', description: 'Free shipping' },
    'STUDENT15': { discount: 15, type: 'percentage', description: '15% student discount' }
  };

  // Handlers
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(id);
      return;
    }

    const item = items.find(item => item.id === id);
    if (item && item.maxQuantity && newQuantity > item.maxQuantity) {
      toast.error(`Only ${item.maxQuantity} items available in stock`);
      return;
    }

    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleIncreaseQuantity = (id) => {
    const item = items.find(item => item.id === id);
    if (item && item.maxQuantity && item.quantity >= item.maxQuantity) {
      toast.error(`Only ${item.maxQuantity} items available in stock`);
      return;
    }
    dispatch(increaseQuantity(id));
  };

  const handleDecreaseQuantity = (id) => {
    dispatch(decreaseQuantity(id));
  };

  const handleRemoveItem = (id) => {
    const item = items.find(item => item.id === id);
    dispatch(removeFromCart(id));
    toast.success(`${item?.name} removed from cart`);
  };

  const handleMoveToWishlist = (item) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    dispatch(toggleWishlist({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    }));

    dispatch(removeFromCart(item.id));
    toast.success(`${item.name} moved to wishlist`);
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    setIsApplyingDiscount(true);

    // Simulate API call
    setTimeout(() => {
      const discount = validDiscountCodes[discountCode.toUpperCase()];

      if (discount) {
        let discountValue = 0;

        if (discount.type === 'percentage') {
          discountValue = (totalAmount * discount.discount) / 100;
        } else if (discount.type === 'fixed') {
          discountValue = discount.discount;
        }

        dispatch(applyDiscount({
          code: discountCode.toUpperCase(),
          discount: discountValue,
          type: discount.type,
          description: discount.description
        }));

        toast.success(`Discount applied: ${discount.description}`);
        setDiscountCode('');
      } else {
        toast.error('Invalid discount code');
      }

      setIsApplyingDiscount(false);
    }, 1000);
  };

  const handleRemoveDiscount = () => {
    dispatch(removeDiscount());
    toast.success('Discount removed');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setShowClearConfirm(false);
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  // Calculate shipping (free shipping over $50)
  const shippingCost = finalAmount >= 50 ? 0 : 9.99;
  const tax = finalAmount * 0.08; // 8% tax
  const orderTotal = finalAmount + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 text-lg mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <div className="space-y-4">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Continue Shopping
              </Link>
              {wishlistItems.length > 0 && (
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Or check your wishlist</p>
                  <Link
                    to="/wishlist"
                    className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <HeartIcon className="h-5 w-5 mr-2" />
                    View Wishlist ({wishlistItems.length} items)
                  </Link>
                </div>
              )}
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
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="space-y-6">
                  {items.map((item) => {
                    const isInWishlist = wishlistItems.some(wishItem => wishItem.id === item.id);

                    return (
                      <div key={`${item.id}-${item.size || ''}-${item.color || ''}`} className="flex items-start space-x-4 py-6 border-b border-gray-200 last:border-b-0">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <Link to={`/product/${item.id}`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-lg hover:opacity-75 transition-opacity"
                            />
                          </Link>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Link
                                to={`/product/${item.id}`}
                                className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                              >
                                {item.name}
                              </Link>

                              {/* Product Options */}
                              {(item.size || item.color) && (
                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                  {item.size && <span>Size: {item.size}</span>}
                                  {item.color && <span>Color: {item.color}</span>}
                                </div>
                              )}

                              {/* Stock Status */}
                              {item.maxQuantity && item.quantity >= item.maxQuantity && (
                                <p className="text-sm text-orange-600 mt-1">
                                  Only {item.maxQuantity} left in stock
                                </p>
                              )}
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Remove item"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Price and Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleDecreaseQuantity(item.id)}
                                  disabled={item.quantity <= 1}
                                  className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max={item.maxQuantity || 99}
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                  className="w-16 px-2 py-2 text-center border-0 focus:ring-0 focus:outline-none"
                                />
                                <button
                                  onClick={() => handleIncreaseQuantity(item.id)}
                                  disabled={item.maxQuantity && item.quantity >= item.maxQuantity}
                                  className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Move to Wishlist */}
                              <button
                                onClick={() => handleMoveToWishlist(item)}
                                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                title="Move to wishlist"
                              >
                                {isInWishlist ? (
                                  <HeartSolidIcon className="h-4 w-4 mr-1 text-red-500" />
                                ) : (
                                  <HeartIcon className="h-4 w-4 mr-1" />
                                )}
                                Save for later
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-600">
                                ${item.price.toFixed(2)} each
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                {/* Discount Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isApplyingDiscount}
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={isApplyingDiscount || !discountCode.trim()}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isApplyingDiscount ? 'Applying...' : 'Apply'}
                    </button>
                  </div>

                  {/* Applied Discount */}
                  {appliedDiscountCode && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <TagIcon className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-800">
                            {appliedDiscountCode}
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveDiscount}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sample Discount Codes */}
                  <div className="mt-3 text-xs text-gray-500">
                    <p>Try: SAVE10, WELCOME20, STUDENT15</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
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

                {/* Free Shipping Progress */}
                {finalAmount < 50 && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TruckIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">
                        Add ${(50 - finalAmount).toFixed(2)} more for FREE shipping!
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((finalAmount / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
                >
                  <div className="flex items-center justify-center">
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </div>
                </button>

                {/* Security Features */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-4 w-4 mr-2 text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center">
                    <TruckIcon className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Free returns within 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Cart Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Clear Cart</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove all items from your cart? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearCart}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
