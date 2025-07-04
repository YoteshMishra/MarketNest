// Mock product data
export const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system.',
    price: 1199,
    originalPrice: 1299,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500'
    ],
    rating: 4.8,
    reviewCount: 1247,
    inStock: true,
    stockQuantity: 25,
    specifications: {
      'Display': '6.7-inch Super Retina XDR',
      'Chip': 'A17 Pro',
      'Storage': '256GB',
      'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
      'Battery': 'Up to 29 hours video playback'
    },
    features: ['5G Ready', 'Face ID', 'Wireless Charging', 'Water Resistant'],
    tags: ['smartphone', 'apple', 'premium', 'latest'],
    discount: 8,
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Ultimate Galaxy experience with S Pen, 200MP camera, and AI-powered features.',
    price: 1099,
    originalPrice: 1199,
    category: 'electronics',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500'
    ],
    rating: 4.7,
    reviewCount: 892,
    inStock: true,
    stockQuantity: 18,
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Storage': '256GB',
      'Camera': '200MP Main, 50MP Periscope Telephoto',
      'Battery': '5000mAh'
    },
    features: ['S Pen Included', '5G Ready', 'Wireless Charging', 'Water Resistant'],
    tags: ['smartphone', 'samsung', 'android', 's-pen'],
    discount: 8,
    isNew: true,
    isFeatured: true
  },
  {
    id: '3',
    name: 'MacBook Pro 16-inch M3',
    description: 'Supercharged for pros with M3 chip, up to 22 hours battery life, and stunning Liquid Retina XDR display.',
    price: 2499,
    originalPrice: 2699,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
    ],
    rating: 4.9,
    reviewCount: 456,
    inStock: true,
    stockQuantity: 12,
    specifications: {
      'Chip': 'Apple M3',
      'Display': '16.2-inch Liquid Retina XDR',
      'Memory': '18GB Unified Memory',
      'Storage': '512GB SSD',
      'Battery': 'Up to 22 hours'
    },
    features: ['M3 Chip', 'Liquid Retina XDR', 'Magic Keyboard', 'Touch ID'],
    tags: ['laptop', 'apple', 'professional', 'm3'],
    discount: 7,
    isNew: true,
    isFeatured: true
  },
  {
    id: '4',
    name: 'Nike Air Max 270',
    description: 'Lifestyle shoe with the largest Max Air unit yet for all-day comfort and style.',
    price: 150,
    originalPrice: 180,
    category: 'fashion',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
    ],
    rating: 4.5,
    reviewCount: 2341,
    inStock: true,
    stockQuantity: 45,
    specifications: {
      'Upper': 'Mesh and synthetic materials',
      'Midsole': 'Foam with Max Air unit',
      'Outsole': 'Rubber with waffle pattern',
      'Closure': 'Lace-up'
    },
    features: ['Max Air Cushioning', 'Breathable Mesh', 'Durable Rubber Outsole'],
    tags: ['shoes', 'nike', 'air-max', 'lifestyle'],
    discount: 17,
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black/White', 'White/Blue', 'Red/Black']
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with exceptional sound quality and 30-hour battery life.',
    price: 399,
    originalPrice: 449,
    category: 'electronics',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    rating: 4.6,
    reviewCount: 1876,
    inStock: true,
    stockQuantity: 32,
    specifications: {
      'Driver': '30mm',
      'Frequency Response': '4Hz-40kHz',
      'Battery Life': '30 hours',
      'Charging': 'USB-C Quick Charge',
      'Weight': '250g'
    },
    features: ['Active Noise Canceling', 'Touch Controls', 'Quick Charge', 'Multipoint Connection'],
    tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
    discount: 11,
    isFeatured: true
  }
];

// Mock categories
export const mockCategories = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300',
    productCount: 1250,
    subcategories: ['Smartphones', 'Laptops', 'Headphones', 'Cameras', 'Gaming']
  },
  {
    id: '2',
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300',
    productCount: 2100,
    subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Bags']
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300',
    productCount: 890,
    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Garden', 'Storage']
  },
  {
    id: '4',
    name: 'Sports',
    slug: 'sports',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
    productCount: 650,
    subcategories: ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports', 'Winter Sports']
  },
  {
    id: '5',
    name: 'Books',
    slug: 'books',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
    productCount: 1500,
    subcategories: ['Fiction', 'Non-Fiction', 'Educational', 'Children\'s Books', 'Comics']
  },
  {
    id: '6',
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300',
    productCount: 780,
    subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Tools']
  }
];

// Mock users
export const mockUsers = [
  {
    id: '1',
    email: 'admin@marketnest.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    phone: '+1234567890',
    addresses: [
      {
        id: '1',
        type: 'home',
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'John Doe',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '+1234567891',
    addresses: [
      {
        id: '1',
        type: 'home',
        name: 'John Doe',
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        isDefault: true
      }
    ],
    createdAt: '2024-02-01T00:00:00Z'
  }
];

// Mock orders
export const mockOrders = [
  {
    id: '1',
    userId: '2',
    items: [
      {
        id: '1',
        name: 'iPhone 15 Pro Max',
        price: 1199,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150'
      }
    ],
    totalAmount: 1199,
    status: 'delivered',
    shippingAddress: {
      name: 'John Doe',
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    paymentMethod: 'credit_card',
    createdAt: '2024-06-01T10:00:00Z',
    deliveredAt: '2024-06-05T14:30:00Z',
    tracking: {
      trackingNumber: 'TRK123456789',
      carrier: 'FedEx'
    }
  }
];

// Mock reviews
export const mockReviews = [
  {
    id: '1',
    productId: '1',
    userId: '2',
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50',
    rating: 5,
    title: 'Amazing phone!',
    comment: 'The iPhone 15 Pro Max exceeded my expectations. The camera quality is outstanding and the battery life is incredible.',
    createdAt: '2024-06-10T09:15:00Z',
    helpful: 12,
    verified: true
  },
  {
    id: '2',
    productId: '1',
    userId: '3',
    userName: 'Jane Smith',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50',
    rating: 4,
    title: 'Great but expensive',
    comment: 'Love the features and performance, but the price point is quite high. Overall satisfied with the purchase.',
    createdAt: '2024-06-08T16:22:00Z',
    helpful: 8,
    verified: true
  }
];

// Mock banners for homepage
export const mockBanners = [
  {
    id: '1',
    title: 'Summer Sale',
    subtitle: 'Up to 50% off on selected items',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200',
    link: '/products?sale=true',
    buttonText: 'Shop Now',
    isActive: true
  },
  {
    id: '2',
    title: 'New iPhone 15 Series',
    subtitle: 'Experience the future of smartphones',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200',
    link: '/product/1',
    buttonText: 'Learn More',
    isActive: true
  },
  {
    id: '3',
    title: 'Fashion Week Special',
    subtitle: 'Trending styles for every occasion',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    link: '/products?category=fashion',
    buttonText: 'Explore',
    isActive: true
  }
];

// Mock brands
export const mockBrands = [
  { id: '1', name: 'Apple', logo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100' },
  { id: '2', name: 'Samsung', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100' },
  { id: '3', name: 'Nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100' },
  { id: '4', name: 'Sony', logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
  { id: '5', name: 'Adidas', logo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=100' },
  { id: '6', name: 'Microsoft', logo: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=100' }
];

export default {
  mockProducts,
  mockCategories,
  mockUsers,
  mockOrders,
  mockReviews,
  mockBanners,
  mockBrands
};
