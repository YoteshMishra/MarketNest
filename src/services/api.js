import { 
  mockProducts, 
  mockCategories, 
  mockUsers, 
  mockOrders, 
  mockReviews, 
  mockBanners,
  mockBrands 
} from '../data/mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'marketnest_products',
  USERS: 'marketnest_users',
  ORDERS: 'marketnest_orders',
  REVIEWS: 'marketnest_reviews',
};

// Initialize data in localStorage if not exists
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(mockReviews));
  }
};

// Initialize data on module load
initializeData();

// Helper functions
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage: ${key}`, error);
  }
};

// Products API
export const productsAPI = {
  // Get all products with filtering and pagination
  getProducts: async (filters = {}) => {
    await delay();
    
    let products = getFromStorage(STORAGE_KEYS.PRODUCTS);
    
    // Apply filters
    if (filters.category) {
      products = products.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }
    
    if (filters.brand) {
      products = products.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase());
    }
    
    if (filters.minPrice || filters.maxPrice) {
      products = products.filter(p => {
        const price = p.price;
        return (!filters.minPrice || price >= filters.minPrice) &&
               (!filters.maxPrice || price <= filters.maxPrice);
      });
    }
    
    if (filters.rating) {
      products = products.filter(p => p.rating >= filters.rating);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      products.sort((a, b) => {
        let aValue = a[filters.sortBy];
        let bValue = b[filters.sortBy];
        
        if (filters.sortBy === 'name') {
          return filters.sortOrder === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
        } else {
          return filters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        }
      });
    }
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      totalProducts: products.length,
      totalPages: Math.ceil(products.length / limit),
      currentPage: page,
      hasNextPage: endIndex < products.length,
      hasPrevPage: page > 1
    };
  },
  
  // Get single product
  getProduct: async (id) => {
    await delay();
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS);
    const product = products.find(p => p.id === id);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  },
  
  // Get featured products
  getFeaturedProducts: async () => {
    await delay();
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS);
    return products.filter(p => p.isFeatured);
  },
  
  // Add product (admin only)
  addProduct: async (productData) => {
    await delay();
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS);
    
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      rating: 0,
      reviewCount: 0,
      reviews: []
    };
    
    products.push(newProduct);
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    
    return newProduct;
  },
  
  // Update product (admin only)
  updateProduct: async (id, updates) => {
    await delay();
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS);
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    products[productIndex] = { ...products[productIndex], ...updates };
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    
    return products[productIndex];
  },
  
  // Delete product (admin only)
  deleteProduct: async (id) => {
    await delay();
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS);
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      throw new Error('Product not found');
    }
    
    saveToStorage(STORAGE_KEYS.PRODUCTS, filteredProducts);
    return { success: true };
  }
};

// Categories API
export const categoriesAPI = {
  getCategories: async () => {
    await delay();
    return mockCategories;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    await delay();
    const users = getFromStorage(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Don't return password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  register: async (userData) => {
    await delay();
    const users = getFromStorage(STORAGE_KEYS.USERS);
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      throw new Error('User already exists with this email');
    }
    
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      role: 'user',
      createdAt: new Date().toISOString(),
      addresses: []
    };
    
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    
    // Don't return password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  updateProfile: async (userId, updates) => {
    await delay();
    const users = getFromStorage(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex] = { ...users[userIndex], ...updates };
    saveToStorage(STORAGE_KEYS.USERS, users);
    
    // Don't return password
    const { password: _, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }
};

// Orders API
export const ordersAPI = {
  getUserOrders: async (userId) => {
    await delay();
    const orders = getFromStorage(STORAGE_KEYS.ORDERS);
    return orders.filter(order => order.userId === userId);
  },
  
  getOrder: async (orderId) => {
    await delay();
    const orders = getFromStorage(STORAGE_KEYS.ORDERS);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  },
  
  createOrder: async (orderData) => {
    await delay();
    const orders = getFromStorage(STORAGE_KEYS.ORDERS);
    
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    orders.push(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    
    return newOrder;
  },
  
  updateOrderStatus: async (orderId, status) => {
    await delay();
    const orders = getFromStorage(STORAGE_KEYS.ORDERS);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return orders[orderIndex];
  }
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: async (productId) => {
    await delay();
    const reviews = getFromStorage(STORAGE_KEYS.REVIEWS);
    return reviews.filter(review => review.productId === productId);
  },
  
  addReview: async (reviewData) => {
    await delay();
    const reviews = getFromStorage(STORAGE_KEYS.REVIEWS);
    
    const newReview = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      helpful: 0
    };
    
    reviews.push(newReview);
    saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
    
    return newReview;
  }
};

// Other APIs
export const bannersAPI = {
  getBanners: async () => {
    await delay();
    return mockBanners.filter(banner => banner.isActive);
  }
};

export const brandsAPI = {
  getBrands: async () => {
    await delay();
    return mockBrands;
  }
};

export default {
  productsAPI,
  categoriesAPI,
  authAPI,
  ordersAPI,
  reviewsAPI,
  bannersAPI,
  brandsAPI
};
