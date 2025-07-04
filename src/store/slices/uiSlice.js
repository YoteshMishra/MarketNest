import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Loading states
  isLoading: false,
  loadingMessage: '',
  
  // Modal states
  modals: {
    authModal: false,
    productModal: false,
    cartModal: false,
    confirmModal: false,
  },
  
  // Sidebar states
  isSidebarOpen: false,
  isMobileMenuOpen: false,
  
  // Toast notifications
  notifications: [],
  
  // Theme
  theme: 'light',
  
  // Search
  isSearchOpen: false,
  
  // Filters
  isFiltersOpen: false,
  
  // Current modal data
  modalData: null,
  
  // Error states
  globalError: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLoadingMessage: (state, action) => {
      state.loadingMessage = action.payload;
    },
    
    // Modals
    openModal: (state, action) => {
      const { modalName, data } = action.payload;
      state.modals[modalName] = true;
      if (data) {
        state.modalData = data;
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      state.modals[modalName] = false;
      if (modalName === state.modalData?.type) {
        state.modalData = null;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
      state.modalData = null;
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    
    // Mobile menu
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    
    // Search
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
    
    // Filters
    toggleFilters: (state) => {
      state.isFiltersOpen = !state.isFiltersOpen;
    },
    closeFilters: (state) => {
      state.isFiltersOpen = false;
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      const id = action.payload;
      state.notifications = state.notifications.filter(notification => notification.id !== id);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    
    // Global error
    setGlobalError: (state, action) => {
      state.globalError = action.payload;
    },
    clearGlobalError: (state) => {
      state.globalError = null;
    },
    
    // Reset UI state
    resetUI: (state) => {
      state.isLoading = false;
      state.loadingMessage = '';
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
      state.modalData = null;
      state.isSidebarOpen = false;
      state.isMobileMenuOpen = false;
      state.isSearchOpen = false;
      state.isFiltersOpen = false;
      state.globalError = null;
    },
  },
});

export const {
  setLoading,
  setLoadingMessage,
  openModal,
  closeModal,
  closeAllModals,
  toggleSidebar,
  closeSidebar,
  toggleMobileMenu,
  closeMobileMenu,
  toggleSearch,
  closeSearch,
  toggleFilters,
  closeFilters,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
  toggleTheme,
  setGlobalError,
  clearGlobalError,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
