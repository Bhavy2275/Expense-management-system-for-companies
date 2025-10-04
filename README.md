# Expense Management Backend

A comprehensive backend API for expense management application built with Node.js, TypeScript, Express, and MongoDB.

## Features

- User management with role-based access (Admin, Manager, Employee)
- Expense tracking and submission
- Approval workflow management
- JWT-based authentication
- MongoDB database integration
- TypeScript for type safety

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Set your MongoDB connection string
   - Configure JWT secret
   - Set other environment variables as needed

## Project Structure

```
src/
├── config/
│   └── db.ts              # Database connection configuration
├── controllers/           # Route controllers (to be implemented)
├── models/
│   ├── user.model.ts      # User schema and model
│   ├── expense.model.ts   # Expense schema and model
│   └── approvalFlow.model.ts # Approval flow schema and model
├── routes/               # API routes (to be implemented)
└── index.ts              # Main server file
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run dev:watch` - Start development server with file watching
- `npm run build` - Build the project for production
- `npm start` - Start the production server

## Database Models

### User Model
- email (unique, required)
- password (required)
- name (required)
- role (Admin, Manager, Employee)
- manager (reference to another user)

### Expense Model
- employee (reference to user)
- description (required)
- category (required)
- amount (required, minimum 0)
- currency (default: USD)
- status (Pending, Approved, Rejected, Processing)
- submissionDate (default: current date)
- currentApproverIndex (default: 0)

### ApprovalFlow Model
- name (unique, required)
- approvers (array of user references)
- type (Sequential, Simultaneous)
- splitVotePercentage (optional)

## API Endpoints

### Public Endpoints
- `GET /` - API information
- `GET /health` - Health check endpoint

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Protected Endpoints (require authentication)
- `GET /api/protected/profile` - Get user profile (any authenticated user)
- `GET /api/protected/admin-only` - Admin only endpoint
- `GET /api/protected/manager-or-admin` - Manager or Admin endpoint
- `GET /api/protected/employee-or-above` - Employee or above endpoint

### Expense Management Endpoints (require authentication)
- `POST /api/expenses` - Submit a new expense
- `GET /api/expenses/my` - Get current user's expenses (with pagination and filtering)
- `GET /api/expenses/:id` - Get a specific expense by ID
- `PUT /api/expenses/:id` - Update a specific expense (only pending expenses)
- `DELETE /api/expenses/:id` - Delete a specific expense (only pending expenses)

### Manager Approval Workflow Endpoints (require authentication)
- `GET /api/expenses/pending-approvals` - Get pending approvals for managers
- `PUT /api/expenses/:id/process` - Process expense approval/rejection

### Admin User Management Endpoints (require admin authentication)
- `POST /api/admin/users` - Create a new user
- `GET /api/admin/users` - Get all users (with pagination and filtering)
- `GET /api/admin/users/:id` - Get a specific user by ID
- `PUT /api/admin/users/:id` - Update a specific user
- `DELETE /api/admin/users/:id` - Delete a specific user

### Admin Approval Flow Management Endpoints (require admin authentication)
- `POST /api/admin/approval-flows` - Create a new approval flow
- `GET /api/admin/approval-flows` - Get all approval flows (with pagination and filtering)
- `GET /api/admin/approval-flows/:id` - Get a specific approval flow by ID
- `PUT /api/admin/approval-flows/:id` - Update a specific approval flow
- `DELETE /api/admin/approval-flows/:id` - Delete a specific approval flow

## Development

1. Start MongoDB service
2. Run the development server:
   ```bash
   npm run dev
   ```
3. The server will start on `http://localhost:3000` (or the port specified in your `.env` file)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/expense-management |
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| BCRYPT_ROUNDS | Bcrypt salt rounds | 12 |

## Authentication

The application includes a complete authentication system with:

- **User Registration**: Create new user accounts with email/password
- **User Login**: Authenticate users and receive JWT tokens
- **Route Protection**: Middleware to protect routes requiring authentication
- **Role-based Access Control**: Different access levels (Admin, Manager, Employee)
- **JWT Token Management**: Secure token-based authentication

### Example Usage

1. **Register a new user**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
   ```

2. **Login**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'
   ```

3. **Access protected route**:
   ```bash
   curl -X GET http://localhost:3000/api/protected/profile \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

4. **Submit an expense**:
   ```bash
   curl -X POST http://localhost:3000/api/expenses \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"description":"Business lunch","category":"Meals","amount":45.50,"currency":"USD"}'
   ```

5. **Get my expenses**:
   ```bash
   curl -X GET http://localhost:3000/api/expenses/my \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

6. **Create a user (admin only)**:
   ```bash
   curl -X POST http://localhost:3000/api/admin/users \
     -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"John Manager","email":"manager@example.com","password":"password123","role":"Manager"}'
   ```

7. **Get all users (admin only)**:
   ```bash
   curl -X GET http://localhost:3000/api/admin/users \
     -H "Authorization: Bearer ADMIN_JWT_TOKEN"
   ```

8. **Create an approval flow (admin only)**:
   ```bash
   curl -X POST http://localhost:3000/api/admin/approval-flows \
     -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Standard Approval","approvers":["user_id_1","user_id_2"],"type":"Sequential"}'
   ```

9. **Get all approval flows (admin only)**:
   ```bash
   curl -X GET http://localhost:3000/api/admin/approval-flows \
     -H "Authorization: Bearer ADMIN_JWT_TOKEN"
   ```

10. **Get pending approvals (manager)**:
    ```bash
    curl -X GET http://localhost:3000/api/expenses/pending-approvals \
      -H "Authorization: Bearer MANAGER_JWT_TOKEN"
    ```

11. **Process expense approval (manager)**:
    ```bash
    curl -X PUT http://localhost:3000/api/expenses/EXPENSE_ID/process \
      -H "Authorization: Bearer MANAGER_JWT_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"action":"approve"}'
    ```

## Next Steps

This foundation provides the basic structure for an expense management system. To complete the application, you would typically add:

1. ✅ Authentication middleware and routes
2. ✅ User registration and login endpoints
3. ✅ Expense CRUD operations
4. ✅ Approval workflow management system
5. ✅ Role-based access control
6. ✅ Input validation and error handling
7. ✅ Admin user management system
8. API documentation
9. Testing suite

## License

MIT
