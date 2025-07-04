# MarketNest - E-Commerce Platform

MarketNest is a modern, full-featured e-commerce platform built with React.js, Redux Toolkit, and Tailwind CSS. It provides a complete shopping experience with user authentication, product management, cart functionality, order processing, and admin panel.

## 🚀 Features

### Customer Features
- **User Authentication**: Secure login/register with role-based access
- **Product Browsing**: Advanced search, filtering, and categorization
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **Checkout Process**: Multi-step checkout with address and payment options
- **Order Management**: Order history, tracking, and status updates
- **User Dashboard**: Profile management, addresses, order history
- **Product Reviews**: Rate and review products
- **Wishlist**: Save favorite products for later

### Admin Features
- **Admin Dashboard**: Comprehensive analytics and overview
- **Product Management**: Full CRUD operations for products
- **Order Management**: View, update, and track all orders
- **User Management**: Manage customer accounts and roles
- **Inventory Control**: Stock management and low-stock alerts
- **Sales Analytics**: Revenue tracking and performance metrics

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Redux Toolkit for efficient state handling
- **Modern UI/UX**: Clean, intuitive interface with loading states
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Mock API**: LocalStorage-based data persistence for demo purposes
- **Hot Reload**: Development server with instant updates

## 🛠️ Tech Stack

- **Frontend**: React.js 19.1.0
- **State Management**: Redux Toolkit 2.8.2
- **Styling**: Tailwind CSS 4.1.11
- **Routing**: React Router DOM 7.6.3
- **Icons**: Heroicons 2.2.0, Lucide React 0.525.0
- **Forms**: React Hook Form 7.59.0
- **Notifications**: React Hot Toast 2.5.2
- **Build Tool**: Vite 7.0.0
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/marketnest.git
   cd marketnest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🎯 Demo Credentials

### Admin Access
- **Email**: admin@marketnest.com
- **Password**: admin123

### Customer Access
- **Email**: user@example.com
- **Password**: user123

## 📱 Screenshots

The application features a modern, responsive design that works seamlessly across all devices.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
marketnest/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Common components (buttons, modals, etc.)
│   │   ├── layout/       # Layout components (header, footer, sidebar)
│   │   └── ui/           # UI-specific components
│   ├── data/             # Mock data and constants
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin panel pages
│   │   ├── auth/         # Authentication pages
│   │   └── user/         # User dashboard pages
│   ├── services/         # API services and utilities
│   ├── store/            # Redux store configuration
│   │   └── slices/       # Redux slices
│   ├── utils/            # Utility functions
│   └── main.jsx          # Application entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
└── README.md            # Project documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Redux Toolkit for simplified state management
- All the open-source contributors who made this project possible

## 📞 Support

For support, email support@marketnest.com or create an issue in this repository.

---

**MarketNest** - Your Ultimate Shopping Destination 🛒
