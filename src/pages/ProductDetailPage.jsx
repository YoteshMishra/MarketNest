import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon,
  HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid';

import { productsAPI, reviewsAPI } from '../services/api';
import { setCurrentProduct, setLoading, setError } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Redux state
  const { currentProduct, loading, error } = useSelector((state) => state.products);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        dispatch(setLoading(true));
        const product = await productsAPI.getProduct(id);
        dispatch(setCurrentProduct(product));

        // Set default selections
        if (product.sizes && product.sizes.length > 0) {
          setSelectedSize(product.sizes[0]);
        }
        if (product.colors && product.colors.length > 0) {
          setSelectedColor(product.colors[0]);
        }
      } catch (err) {
        dispatch(setError(err.message));
        toast.error('Product not found');
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, dispatch]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!currentProduct) return;

      try {
        setReviewsLoading(true);
        const productReviews = await reviewsAPI.getProductReviews(currentProduct.id);
        setReviews(productReviews);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [currentProduct]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!currentProduct) return;

      try {
        const { products } = await productsAPI.getProducts({
          category: currentProduct.category,
          limit: 4
        });
        // Filter out current product
        const filtered = products.filter(p => p.id !== currentProduct.id);
        setRelatedProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch related products:', err);
      }
    };

    fetchRelatedProducts();
  }, [currentProduct]);

  // Handlers
  const handleAddToCart = () => {
    if (!currentProduct) return;

    const cartItem = {
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.images[0],
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      maxQuantity: currentProduct.stockQuantity
    };

    dispatch(addToCart(cartItem));
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    if (!currentProduct) return;

    dispatch(toggleWishlist({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.images[0]
    }));

    const isInWishlist = wishlistItems.some(item => item.id === currentProduct.id);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (currentProduct?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleImageNavigation = (direction) => {
    if (!currentProduct?.images) return;

    const totalImages = currentProduct.images.length;
    if (direction === 'next') {
      setSelectedImageIndex((prev) => (prev + 1) % totalImages);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentProduct?.name,
          text: currentProduct?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-300 h-8 rounded w-3/4"></div>
                <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                <div className="bg-gray-300 h-6 rounded w-1/4"></div>
                <div className="bg-gray-300 h-20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlistItems.some(item => item.id === currentProduct.id);
  const isInCart = cartItems.some(item => item.id === currentProduct.id);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <Link
            to={`/products?category=${currentProduct.category}`}
            className="hover:text-blue-600 capitalize"
          >
            {currentProduct.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{currentProduct.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
          {/* Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img
                src={currentProduct.images[selectedImageIndex]}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {currentProduct.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-md transition-colors touch-manipulation"
                  >
                    <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-md transition-colors touch-manipulation"
                  >
                    <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                  {Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)}% OFF
                </div>
              )}

              {/* New Badge */}
              {currentProduct.isNew && (
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                  NEW
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {currentProduct.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {currentProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors touch-manipulation ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${currentProduct.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Title and Brand */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-600 font-medium">{currentProduct.brand}</span>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
                  title="Share product"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">{currentProduct.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(currentProduct.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {currentProduct.rating} ({currentProduct.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">${currentProduct.price}</span>
              {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                <span className="text-lg sm:text-xl text-gray-500 line-through">${currentProduct.originalPrice}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {currentProduct.inStock ? (
                <>
                  <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  <span className="text-green-600 font-medium text-sm sm:text-base">In Stock ({currentProduct.stockQuantity} available)</span>
                </>
              ) : (
                <>
                  <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  <span className="text-red-600 font-medium text-sm sm:text-base">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{currentProduct.description}</p>
            </div>

            {/* Product Options */}
            {(currentProduct.sizes || currentProduct.colors) && (
              <div className="space-y-4">
                {/* Size Selection */}
                {currentProduct.sizes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 sm:px-4 py-2 border rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                            selectedSize === size
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {currentProduct.colors && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProduct.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 sm:px-4 py-2 border rounded-lg text-sm font-medium capitalize transition-colors touch-manipulation ${
                            selectedColor === color
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2.5 sm:p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed touch-manipulation"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="px-3 sm:px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (currentProduct.stockQuantity || 1)}
                    className="p-2.5 sm:p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed touch-manipulation"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {currentProduct.stockQuantity} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!currentProduct.inStock}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 touch-manipulation"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>{isInCart ? 'Update Cart' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 border rounded-lg transition-colors touch-manipulation sm:flex-shrink-0 ${
                    isInWishlist
                      ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800'
                  }`}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {isInWishlist ? (
                      <HeartSolidIcon className="h-5 w-5" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                    <span className="sm:hidden">{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                  </div>
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={() => {
                  handleAddToCart();
                  navigate('/checkout');
                }}
                disabled={!currentProduct.inStock}
                className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Buy Now
              </button>
            </div>

            {/* Features/Benefits */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <TruckIcon className="h-5 w-5" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ArrowPathIcon className="h-5 w-5" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>2-Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="border-t">
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && ` (${reviews.length})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  {currentProduct.description}
                </p>

                {currentProduct.features && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {currentProduct.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Product Specifications</h3>
                {currentProduct.specifications ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(currentProduct.specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 pb-3">
                        <dt className="text-sm font-medium text-gray-900 mb-1">{key}</dt>
                        <dd className="text-sm text-gray-700">{value}</dd>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No specifications available for this product.</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>
                  {isAuthenticated && (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Write a Review
                    </button>
                  )}
                </div>

                {/* Reviews Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{currentProduct.rating}</div>
                      <div className="flex items-center justify-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <StarSolidIcon
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(currentProduct.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{currentProduct.reviewCount} reviews</div>
                    </div>

                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => Math.floor(r.rating) === rating).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                        return (
                          <div key={rating} className="flex items-center space-x-2 mb-1">
                            <span className="text-sm text-gray-600 w-8">{rating}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse border-b border-gray-200 pb-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-gray-300 rounded-full h-10 w-10"></div>
                          <div className="space-y-2">
                            <div className="bg-gray-300 h-4 rounded w-24"></div>
                            <div className="bg-gray-300 h-3 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                          <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start space-x-3">
                          <img
                            src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=random`}
                            alt={review.userName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">{review.userName}</h4>
                              {review.verified && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Verified Purchase
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <StarSolidIcon
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            {review.title && (
                              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                            )}

                            <p className="text-gray-700 mb-3">{review.comment}</p>

                            <div className="flex items-center space-x-4 text-sm">
                              <button className="text-gray-600 hover:text-gray-800 flex items-center space-x-1">
                                <span>Helpful ({review.helpful})</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <div key={product.id} className="group">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square mb-3 group-hover:opacity-75 transition-opacity">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarSolidIcon
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">({product.reviewCount})</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
