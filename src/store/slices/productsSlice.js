import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  featuredProducts: [],
  categories: [],
  currentProduct: null,
  filters: {
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    brand: '',
    sortBy: 'name',
    sortOrder: 'asc',
  },
  searchQuery: '',
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    productsPerPage: 12,
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Products
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Categories
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    
    // Filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: [0, 1000],
        rating: 0,
        brand: '',
        sortBy: 'name',
        sortOrder: 'asc',
      };
    },
    
    // Search
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    // Pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // Product management (for admin)
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const { id, updates } = action.payload;
      const productIndex = state.products.findIndex(product => product.id === id);
      if (productIndex !== -1) {
        state.products[productIndex] = { ...state.products[productIndex], ...updates };
      }
      // Update current product if it's the same
      if (state.currentProduct && state.currentProduct.id === id) {
        state.currentProduct = { ...state.currentProduct, ...updates };
      }
    },
    deleteProduct: (state, action) => {
      const id = action.payload;
      state.products = state.products.filter(product => product.id !== id);
      // Clear current product if it's the deleted one
      if (state.currentProduct && state.currentProduct.id === id) {
        state.currentProduct = null;
      }
    },
    
    // Reviews
    addReview: (state, action) => {
      const { productId, review } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        if (!product.reviews) {
          product.reviews = [];
        }
        product.reviews.push(review);
        
        // Recalculate average rating
        const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
        product.rating = totalRating / product.reviews.length;
        product.reviewCount = product.reviews.length;
      }
      
      // Update current product if it's the same
      if (state.currentProduct && state.currentProduct.id === productId) {
        if (!state.currentProduct.reviews) {
          state.currentProduct.reviews = [];
        }
        state.currentProduct.reviews.push(review);
        
        const totalRating = state.currentProduct.reviews.reduce((sum, r) => sum + r.rating, 0);
        state.currentProduct.rating = totalRating / state.currentProduct.reviews.length;
        state.currentProduct.reviewCount = state.currentProduct.reviews.length;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  setFeaturedProducts,
  setCurrentProduct,
  setCategories,
  setFilters,
  resetFilters,
  setSearchQuery,
  setPagination,
  addProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = productsSlice.actions;

export default productsSlice.reducer;
