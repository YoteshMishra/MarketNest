import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  StarIcon,
  HeartIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { productsAPI, categoriesAPI } from '../services/api';
import { ProductCardSkeleton } from '../components/common/LoadingSkeleton';
import {
  setProducts,
  setCategories,
  setFilters,
  resetFilters,
  setSearchQuery,
  setPagination,
  setLoading,
  setError
} from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [availableBrands, setAvailableBrands] = useState([]);

  const dispatch = useDispatch();
  const {
    products,
    categories,
    filters,
    searchQuery,
    pagination,
    loading,
    error
  } = useSelector((state) => state.products);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Initialize filters from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const priceMinParam = searchParams.get('priceMin');
    const priceMaxParam = searchParams.get('priceMax');
    const ratingParam = searchParams.get('rating');
    const brandParam = searchParams.get('brand');
    const sortParam = searchParams.get('sort');
    const pageParam = searchParams.get('page');

    const urlFilters = {};
    if (categoryParam) urlFilters.category = categoryParam;
    if (priceMinParam) urlFilters.priceRange = [parseInt(priceMinParam), filters.priceRange[1]];
    if (priceMaxParam) urlFilters.priceRange = [filters.priceRange[0], parseInt(priceMaxParam)];
    if (ratingParam) urlFilters.rating = parseInt(ratingParam);
    if (brandParam) urlFilters.brand = brandParam;
    if (sortParam) {
      const [sortBy, sortOrder] = sortParam.split('-');
      urlFilters.sortBy = sortBy;
      urlFilters.sortOrder = sortOrder;
    }

    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters));
    }

    if (searchParam) {
      dispatch(setSearchQuery(searchParam));
      setLocalSearchQuery(searchParam);
    }

    if (pageParam) {
      dispatch(setPagination({ currentPage: parseInt(pageParam) }));
    }
  }, [searchParams, dispatch]);

  // Fetch categories and initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        dispatch(setLoading(true));
        const [categoriesData] = await Promise.all([
          categoriesAPI.getCategories()
        ]);
        dispatch(setCategories(categoriesData));

        // Extract unique brands from all products for filter options
        const allProductsResponse = await productsAPI.getProducts({ limit: 1000 });
        const brands = [...new Set(allProductsResponse.products.map(p => p.brand))].sort();
        setAvailableBrands(brands);

      } catch (error) {
        console.error('Error fetching initial data:', error);
        dispatch(setError('Failed to load categories'));
      }
    };

    fetchInitialData();
  }, [dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(setLoading(true));

        const apiFilters = {
          category: filters.category,
          brand: filters.brand,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          rating: filters.rating,
          search: searchQuery,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          page: pagination.currentPage,
          limit: pagination.productsPerPage
        };

        const response = await productsAPI.getProducts(apiFilters);

        dispatch(setProducts(response.products));
        dispatch(setPagination({
          totalProducts: response.totalProducts,
          totalPages: response.totalPages,
          currentPage: response.currentPage
        }));

      } catch (error) {
        console.error('Error fetching products:', error);
        dispatch(setError('Failed to load products'));
        toast.error('Failed to load products');
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProducts();
  }, [filters, searchQuery, pagination.currentPage, dispatch]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.category) params.set('category', filters.category);
    if (searchQuery) params.set('search', searchQuery);
    if (filters.priceRange[0] > 0) params.set('priceMin', filters.priceRange[0].toString());
    if (filters.priceRange[1] < 1000) params.set('priceMax', filters.priceRange[1].toString());
    if (filters.rating > 0) params.set('rating', filters.rating.toString());
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.sortBy !== 'name' || filters.sortOrder !== 'asc') {
      params.set('sort', `${filters.sortBy}-${filters.sortOrder}`);
    }
    if (pagination.currentPage > 1) params.set('page', pagination.currentPage.toString());

    setSearchParams(params);
  }, [filters, searchQuery, pagination.currentPage, setSearchParams]);

  // Handler functions
  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
    dispatch(setPagination({ currentPage: 1 })); // Reset to first page
  };

  const handlePriceRangeChange = (min, max) => {
    dispatch(setFilters({ priceRange: [min, max] }));
    dispatch(setPagination({ currentPage: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearchQuery));
    dispatch(setPagination({ currentPage: 1 }));
  };

  const handleSortChange = (sortBy, sortOrder) => {
    dispatch(setFilters({ sortBy, sortOrder }));
    dispatch(setPagination({ currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    dispatch(setPagination({ currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(setSearchQuery(''));
    setLocalSearchQuery('');
    dispatch(setPagination({ currentPage: 1 }));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    dispatch(toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    }));

    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const sortOptions = [
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Rating: High to Low' },
    { value: 'rating-asc', label: 'Rating: Low to High' },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            {filters.category ? `${filters.category} Products` : 'All Products'}
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4 sm:mb-6">
            <div className="relative max-w-full sm:max-w-md">
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 touch-manipulation"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Filters and Sort Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
              {/* Filter Toggle */}
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap touch-manipulation"
              >
                <FunnelIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Filters</span>
                {(filters.category || filters.brand || filters.rating > 0 ||
                  filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                  <span className="bg-blue-600 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    Active
                  </span>
                )}
              </button>

              {/* Clear Filters */}
              {(filters.category || filters.brand || filters.rating > 0 ||
                filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium whitespace-nowrap touch-manipulation"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Results Count - Mobile: Full width, Desktop: Right side */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-gray-600 text-sm order-2 sm:order-1">
                {loading ? 'Loading...' : `${pagination.totalProducts} products found`}
              </span>

              <div className="flex items-center gap-2 sm:gap-4 order-1 sm:order-2">
                {/* Sort Dropdown */}
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleSortChange(sortBy, sortOrder);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1 sm:flex-none"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle - Hidden on mobile */}
                <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 touch-manipulation ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Squares2X2Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 touch-manipulation ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <ListBulletIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Filters Sidebar - Mobile: Full width overlay, Desktop: Sidebar */}
          <div className={`${isFiltersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            {/* Mobile Overlay */}
            {isFiltersOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsFiltersOpen(false)} />
            )}

            <div className={`bg-white rounded-lg shadow-sm p-4 sm:p-6 ${isFiltersOpen ? 'fixed inset-x-4 top-4 bottom-4 z-50 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:overflow-visible' : 'lg:sticky lg:top-4'}`}>
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded touch-manipulation"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={!filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="mr-2"
                    />
                    All Categories
                  </label>
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.slug}
                        checked={filters.category === category.slug}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="mr-2"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(parseInt(e.target.value) || 0, filters.priceRange[1])}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(filters.priceRange[0], parseInt(e.target.value) || 1000)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Under $25', min: 0, max: 25 },
                      { label: '$25 - $50', min: 25, max: 50 },
                      { label: '$50 - $100', min: 50, max: 100 },
                      { label: '$100 - $200', min: 100, max: 200 },
                      { label: 'Over $200', min: 200, max: 1000 }
                    ].map(range => (
                      <label key={range.label} className="flex items-center">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceRange[0] === range.min && filters.priceRange[1] === range.max}
                          onChange={() => handlePriceRangeChange(range.min, range.max)}
                          className="mr-2"
                        />
                        {range.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Brand</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="brand"
                      value=""
                      checked={!filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="mr-2"
                    />
                    All Brands
                  </label>
                  {availableBrands.map(brand => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={filters.brand === brand}
                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                        className="mr-2"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                        className="mr-2"
                      />
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">& up</span>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value={0}
                      checked={filters.rating === 0}
                      onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                      className="mr-2"
                    />
                    All Ratings
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-3 sm:p-4 animate-pulse">
                    <div className="bg-gray-300 h-40 sm:h-48 rounded mb-3 sm:mb-4"></div>
                    <div className="bg-gray-300 h-3 sm:h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-3 sm:h-4 rounded w-2/3 mb-2"></div>
                    <div className="bg-gray-300 h-3 sm:h-4 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Loading Skeletons */}
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(9)].map((_, index) => (
                      <ProductCardSkeleton key={index} />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Products Grid */}
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {products.map(product => (
                      <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                        <div className="relative">
                          <Link to={`/product/${product.id}`}>
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>

                          {/* Wishlist Button */}
                          <button
                            onClick={() => handleToggleWishlist(product)}
                            className="absolute top-2 right-2 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors touch-manipulation"
                          >
                            {wishlistItems.some(item => item.id === product.id) ? (
                              <HeartSolidIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                            ) : (
                              <HeartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            )}
                          </button>

                          {/* Discount Badge */}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </div>
                          )}
                        </div>

                        <div className="p-3 sm:p-4">
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2 hidden sm:block">
                            {product.description}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="ml-1 text-xs sm:text-sm text-gray-600">
                              ({product.reviewCount || 0})
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span className="text-base sm:text-lg font-bold text-gray-900">
                                ${product.price}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-xs sm:text-sm text-gray-500 line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">{product.brand}</span>
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-blue-600 text-white py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium touch-manipulation"
                          >
                            <ShoppingCartIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Add to Cart</span>
                            <span className="sm:hidden">Add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Products List View */
                  <div className="space-y-4">
                    {products.map(product => (
                      <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <div className="flex">
                          <div className="relative w-48 flex-shrink-0">
                            <Link to={`/product/${product.id}`}>
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-32 object-cover"
                              />
                            </Link>

                            {/* Discount Badge */}
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </div>
                            )}
                          </div>

                          <div className="flex-1 p-4 flex justify-between">
                            <div className="flex-1">
                              <Link to={`/product/${product.id}`}>
                                <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                  {product.name}
                                </h3>
                              </Link>

                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {product.description}
                              </p>

                              {/* Rating */}
                              <div className="flex items-center mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-1 text-sm text-gray-600">
                                  ({product.reviewCount || 0})
                                </span>
                              </div>

                              <span className="text-sm text-gray-600">{product.brand}</span>
                            </div>

                            <div className="flex flex-col items-end justify-between ml-4">
                              {/* Price */}
                              <div className="text-right mb-2">
                                <div className="text-lg font-bold text-gray-900">
                                  ${product.price}
                                </div>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <div className="text-sm text-gray-500 line-through">
                                    ${product.originalPrice}
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleToggleWishlist(product)}
                                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  {wishlistItems.some(item => item.id === product.id) ? (
                                    <HeartSolidIcon className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <HeartIcon className="h-4 w-4 text-gray-400" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                  <ShoppingCartIcon className="h-4 w-4" />
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  )}
                </>
                )}
              </>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`px-3 py-2 rounded-lg ${
                      pagination.currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === pagination.currentPage;
                    const shouldShow =
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 2 && page <= pagination.currentPage + 2);

                    if (!shouldShow) {
                      if (page === pagination.currentPage - 3 || page === pagination.currentPage + 3) {
                        return <span key={page} className="px-2 text-gray-400">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg ${
                          isCurrentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`px-3 py-2 rounded-lg ${
                      pagination.currentPage === pagination.totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
