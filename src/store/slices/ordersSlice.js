import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  orderStatuses: [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned'
  ],
};

const ordersSlice = createSlice({
  name: 'orders',
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
    
    // Orders
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Create order
    createOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      state.orders.unshift(newOrder);
      state.currentOrder = newOrder;
      state.loading = false;
      state.error = null;
    },
    
    // Update order status
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
        
        // Add status history
        if (!order.statusHistory) {
          order.statusHistory = [];
        }
        order.statusHistory.push({
          status,
          timestamp: new Date().toISOString(),
        });
      }
      
      // Update current order if it's the same
      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.currentOrder.status = status;
        state.currentOrder.updatedAt = new Date().toISOString();
        if (!state.currentOrder.statusHistory) {
          state.currentOrder.statusHistory = [];
        }
        state.currentOrder.statusHistory.push({
          status,
          timestamp: new Date().toISOString(),
        });
      }
    },
    
    // Cancel order
    cancelOrder: (state, action) => {
      const orderId = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order && ['pending', 'confirmed'].includes(order.status)) {
        order.status = 'cancelled';
        order.updatedAt = new Date().toISOString();
        
        if (!order.statusHistory) {
          order.statusHistory = [];
        }
        order.statusHistory.push({
          status: 'cancelled',
          timestamp: new Date().toISOString(),
        });
      }
      
      // Update current order if it's the same
      if (state.currentOrder && state.currentOrder.id === orderId) {
        if (['pending', 'confirmed'].includes(state.currentOrder.status)) {
          state.currentOrder.status = 'cancelled';
          state.currentOrder.updatedAt = new Date().toISOString();
          if (!state.currentOrder.statusHistory) {
            state.currentOrder.statusHistory = [];
          }
          state.currentOrder.statusHistory.push({
            status: 'cancelled',
            timestamp: new Date().toISOString(),
          });
        }
      }
    },
    
    // Return order
    returnOrder: (state, action) => {
      const { orderId, reason } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order && order.status === 'delivered') {
        order.status = 'returned';
        order.returnReason = reason;
        order.updatedAt = new Date().toISOString();
        
        if (!order.statusHistory) {
          order.statusHistory = [];
        }
        order.statusHistory.push({
          status: 'returned',
          timestamp: new Date().toISOString(),
          reason,
        });
      }
    },
    
    // Add tracking info
    addTrackingInfo: (state, action) => {
      const { orderId, trackingNumber, carrier } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.tracking = {
          trackingNumber,
          carrier,
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Update current order if it's the same
      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.currentOrder.tracking = {
          trackingNumber,
          carrier,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Clear current order
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
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
  setOrders,
  setCurrentOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  returnOrder,
  addTrackingInfo,
  clearCurrentOrder,
  clearError,
} = ordersSlice.actions;

export default ordersSlice.reducer;
