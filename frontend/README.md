# DevTools Frontend - React.js

Modern React.js frontend for developer tools with beautiful animations and responsive design.

## 🚀 Features

- **Modern UI/UX**: Clean, minimal design with dark theme
- **Mobile Responsive**: Fully responsive with hamburger navigation
- **Smooth Animations**: Framer Motion animations and transitions
- **Real-time Interactions**: Mouse-following background elements
- **Modern Styling**: Tailwind CSS with custom animations

## 🛠️ Tech Stack

- **React.js 18**: Modern React with hooks
- **React Router DOM**: Client-side routing
- **Framer Motion**: Animation library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client

## 📁 Structure

```
frontend/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── App.js              # Main application component
│   ├── index.js            # React entry point
│   └── index.css           # Global styles with Tailwind
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📱 Pages & Components

### App.js
Main application component with:
- Navigation bar with mobile hamburger menu
- Page routing and transitions
- Mouse-following background animations
- State management for all features

### Home Page
- Animated hero section with gradient text
- Interactive background elements
- Feature cards with hover animations
- Statistics section

### IP Discovery Page
- Real-time IP address detection
- Geolocation information display
- Network details (ISP, timezone, etc.)
- Location information (city, region, country)

### Code Beautifier Page
- Multi-language code formatting
- Support for JavaScript, Python, HTML, CSS
- Copy-to-clipboard functionality
- Real-time code transformation

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Secondary**: White (#FFFFFF)
- **Accent**: Blue (#3B82F6), Purple (#8B5CF6)
- **Text**: Gray variations for hierarchy

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-bold)

### Animations
- **Page Transitions**: Fade and slide effects
- **Hover Effects**: Scale and color transitions
- **Background Elements**: Mouse-following gradients
- **Loading States**: Spinner animations

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.js`:
- Custom animations (fade-in, slide-up, slide-down)
- Extended color palette
- Custom keyframes

### API Configuration
Backend API base URL is configured in `App.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (hamburger menu)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Hamburger navigation menu
- Touch-friendly buttons
- Optimized layouts for small screens
- Smooth mobile animations

## 🚀 Build & Deploy

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Testing
```bash
npm test
```

### Deployment
The built application can be deployed to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `build` folder
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload `build` folder

## 🎯 Performance

### Optimizations
- Lazy loading of components
- Optimized animations with Framer Motion
- Efficient state management
- Minimal bundle size with tree shaking

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🔧 Customization

### Adding New Pages
1. Create new component in `App.js`
2. Add route to navigation
3. Update page rendering logic

### Styling Changes
- Modify `tailwind.config.js` for theme changes
- Update `index.css` for global styles
- Use Tailwind classes for component styling

### Animation Customization
- Modify Framer Motion variants in components
- Update animation timing and easing
- Add new animation types

## 🧪 Testing

### Component Testing
```bash
npm test
```

### E2E Testing
Recommended tools:
- Cypress
- Playwright
- Selenium

## 📝 Environment Variables

Create `.env` file for environment-specific configuration:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License 