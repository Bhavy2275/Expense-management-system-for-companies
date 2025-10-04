# Expense Management Frontend

A modern Next.js frontend application for the Expense Management System with user authentication and role-based access control.

## 🚀 Features

- **User Authentication**: Login and registration with JWT tokens
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Role-Based Access**: Different interfaces for Employee, Manager, and Admin roles
- **Modern UI**: Built with Tailwind CSS and responsive design
- **State Management**: Zustand for global state management
- **Form Validation**: React Hook Form with comprehensive validation
- **Notifications**: Toast notifications for user feedback
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Authentication**: JWT-based with localStorage persistence

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout with Toaster
│   └── page.tsx           # Protected dashboard
├── components/            # Reusable UI components
│   ├── Button.tsx         # Custom button component
│   └── Input.tsx          # Custom input component
├── hooks/                 # Custom React hooks
│   └── useAuth.ts         # Authentication hooks
├── services/              # API communication
│   ├── api.ts            # Axios instance configuration
│   └── authService.ts    # Authentication service
└── store/                # Zustand stores
    └── authStore.ts      # Authentication state management
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3000`

### Installation

1. **Clone and navigate to the frontend directory:**
   ```bash
   cd expense-management-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" > .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3001` (or the port shown in terminal)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### API Configuration

The frontend is configured to communicate with the backend API. Make sure your backend is running on the specified URL.

## 📱 Pages and Routes

### Public Routes
- `/` - Protected dashboard (redirects to login if not authenticated)
- `/login` - User login page
- `/register` - User registration page

### Protected Routes
- `/` - Main dashboard (requires authentication)
- All routes automatically redirect to `/login` if user is not authenticated

## 🔐 Authentication Flow

### Login Process
1. User enters email and password
2. Form validation ensures proper format
3. API call to `/auth/login` endpoint
4. JWT token stored in localStorage
5. User data stored in Zustand store
6. Automatic redirect to dashboard
7. Success toast notification

### Registration Process
1. User enters name, email, password, and confirmation
2. Form validation ensures data integrity
3. API call to `/auth/register` endpoint
4. Automatic login after successful registration
5. Redirect to dashboard

### Logout Process
1. Clear localStorage (token and user data)
2. Clear Zustand store
3. Redirect to login page

## 🎨 UI Components

### Button Component
```tsx
<Button 
  variant="primary" 
  size="md" 
  isLoading={false}
  onClick={handleClick}
>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `disabled`: boolean

### Input Component
```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={errors.email?.message}
  {...register('email')}
/>
```

**Props:**
- `label`: string (optional)
- `error`: string (optional)
- `helperText`: string (optional)
- All standard HTML input props

## 🔄 State Management

### Auth Store (Zustand)
```tsx
const { 
  user, 
  token, 
  isAuthenticated, 
  isLoading, 
  error,
  login, 
  logout, 
  register 
} = useAuthStore();
```

**State:**
- `user`: Current user object
- `token`: JWT token
- `isAuthenticated`: Boolean authentication status
- `isLoading`: Loading state for async operations
- `error`: Error message string

**Actions:**
- `login(email, password)`: Authenticate user
- `logout()`: Clear authentication data
- `register(name, email, password)`: Register new user
- `setLoading(boolean)`: Set loading state
- `setError(string)`: Set error message
- `clearError()`: Clear error message

## 🛡️ Protected Routes

### useRequireAuth Hook
```tsx
const { user, isAuthenticated } = useRequireAuth();
```

This hook:
- Automatically redirects to `/login` if not authenticated
- Initializes auth state from localStorage
- Returns current user and authentication status

### useAuth Hook
```tsx
const { user, isAuthenticated, token } = useAuth();
```

This hook provides authentication state without automatic redirection.

## 🔌 API Integration

### Axios Configuration
- Base URL: `http://localhost:3000/api`
- Automatic JWT token injection
- Request/response interceptors
- Automatic logout on 401 errors

### Authentication Service
```tsx
// Login
const response = await authService.login({ email, password });

// Register
const response = await authService.register({ name, email, password });

// Get profile
const profile = await authService.getProfile();
```

## 🎯 User Roles and Permissions

### Employee
- View personal dashboard
- Submit new expenses
- View own expense history
- Update pending expenses

### Manager
- All employee permissions
- View pending approvals
- Approve/reject expenses
- View team expenses

### Admin
- All manager permissions
- User management
- Approval flow management
- System administration

## 🚀 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Structure
- **Components**: Reusable UI components with TypeScript
- **Hooks**: Custom React hooks for authentication
- **Services**: API communication layer
- **Store**: Global state management with Zustand
- **Pages**: Next.js App Router pages

## 🔧 Customization

### Styling
- Tailwind CSS for utility-first styling
- Custom component classes
- Responsive design patterns
- Dark mode support (ready for implementation)

### Theming
- Consistent color palette
- Typography system
- Spacing and sizing standards
- Component variants

## 🧪 Testing

### Manual Testing
1. **Registration Flow:**
   - Navigate to `/register`
   - Fill out form with valid data
   - Verify successful registration and auto-login

2. **Login Flow:**
   - Navigate to `/login`
   - Enter valid credentials
   - Verify successful login and redirect

3. **Protected Routes:**
   - Try accessing `/` without authentication
   - Verify redirect to login page
   - Login and verify access to dashboard

4. **Logout Flow:**
   - Click logout button
   - Verify localStorage is cleared
   - Verify redirect to login page

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js
- **Netlify**: Static site deployment
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Errors:**
   - Verify backend is running
   - Check API URL in environment variables
   - Ensure CORS is configured on backend

2. **Authentication Issues:**
   - Clear localStorage and try again
   - Check JWT token expiration
   - Verify backend authentication endpoints

3. **Build Errors:**
   - Check TypeScript errors
   - Verify all imports are correct
   - Ensure all dependencies are installed

## 📚 Next Steps

### Planned Features
- [ ] Expense submission forms
- [ ] Expense management interface
- [ ] Approval workflow interface
- [ ] Admin panel
- [ ] Reporting and analytics
- [ ] Mobile responsive improvements
- [ ] Dark mode theme
- [ ] Advanced filtering and search
- [ ] File upload for receipts
- [ ] Email notifications

### Integration Points
- Backend API endpoints
- Database synchronization
- Real-time updates
- File storage integration
- Email service integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Expense Management System and follows the same licensing terms.
