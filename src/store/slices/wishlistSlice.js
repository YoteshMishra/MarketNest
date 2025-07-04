import { createSlice } from '@reduxjs/toolkit';

// Load wishlist from localStorage
const loadWishlistFromStorage = () => {
  try {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    return [];
  }
};

const initialState = {
  items: loadWishlistFromStorage(),
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
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
    
    // Add to wishlist
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (!existingItem) {
        state.items.push({
          ...product,
          addedAt: new Date().toISOString(),
        });
        
        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
    
    // Remove from wishlist
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    
    // Clear wishlist
    clearWishlist: (state) => {
      state.items = [];
      
      // Clear localStorage
      localStorage.removeItem('wishlist');
    },
    
    // Move to cart
    moveToCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    
    // Check if item is in wishlist
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Remove from wishlist
        state.items.splice(existingItemIndex, 1);
      } else {
        // Add to wishlist
        state.items.push({
          ...product,
          addedAt: new Date().toISOString(),
        });
      }
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    
    // Update wishlist item (in case product details change)
    updateWishlistItem: (state, action) => {
      const { id, updates } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      
      if (itemIndex !== -1) {
        state.items[itemIndex] = { ...state.items[itemIndex], ...updates };
        
        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
    
    // Set wishlist (for syncing with server)
    setWishlist: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
  toggleWishlist,
  updateWishlistItem,
  setWishlist,
  clearError,
} = wishlistSlice.actions;

// Selectors
export const selectIsInWishlist = (state, productId) => {
  return state.wishlist.items.some(item => item.id === productId);
};

export const selectWishlistCount = (state) => {
  return state.wishlist.items.length;
};

export default wishlistSlice.reducer;
