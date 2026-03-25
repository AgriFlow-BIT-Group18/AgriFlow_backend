# AgriFlow Backend API Core 🚀

The backbone of the AgriFlow ecosystem, providing a high-performance RESTful API for agricultural resource management, real-time analytics, and secure role-based access control.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.0+)
- **Database**: MongoDB (via Mongoose)
- **Security**: JWT Authentication, Bcrypt password hashing, Helmet security headers, CORS protection.
- **Monitoring**: Morgan logging middleware.
- **Documentation**: Swagger/OpenAPI.

## 📂 Project Structure

- `controllers/`: Business logic for each resource module.
- `models/`: Mongoose schemas (User, Product, Order, Delivery).
- `routes/`: API endpoint definitions and middleware mapping.
- `middlewares/`: Authentication and role-based authorization filters.
- `scripts/`: Utility scripts (Database seeding, maintenance).

---

## 🔄 Authentication & Ecosystem Integration

### 🔑 Authentication Flow (JWT)
The system uses **JSON Web Tokens (JWT)** for secure, stateless authentication:
1.  **Request**: User sends credentials to `POST /api/auth/login`.
2.  **Verification**: Backend validates credentials against MongoDB.
3.  **Token Issuance**: Backend returns a signed JWT.
4.  **Authorized Access**: Frontend/Mobile must include this token in the `Authorization` header (`Bearer <token>`) for all protected routes.

### 🌐 Integration Points
- **Web Dashboard**: Connects via `https://agriflow-backend-te8k.onrender.com/api` (Production) or `http://localhost:5000/api` (Local).
- **Mobile App**: Uses the same production endpoint to ensure synchronized data for farmers.
- **AI Sync**: While the AI connects directly to Groq, its context is derived from the Backend's data models (Products, Orders, Deliveries).

---

## 🔑 Authentication & Roles

The system uses JWT-based authentication. Include the token in the `Authorization` header: `Bearer <token>`.

### Roles
- **Admin**: Full system access (CRUD on all resources).
- **Distributor**: Professional access (Audit view of users/orders, access to analytics/reports).
- **Farmer**: Personal access (Catalogue viewing, ordering, delivery tracking).

## 📡 API Endpoints Summary

### Authentication
- `POST /api/auth/login`: Authenticate user and return JWT.
- `POST /api/auth/register`: Create a new farmer account.

### User Management
- `GET /api/users`: List users (Admin/Distributor).
- `PUT /api/users/:id`: Update profile (Self or Admin).
- `DELETE /api/users/:id`: Remove user (Admin only).

### Inventory
- `GET /api/products`: List all agricultural inputs.
- `POST /api/products`: Add new input (Admin only).
- `DELETE /api/products/:id`: Remove input (Admin only).

### Orders
- `GET /api/orders`: List all orders (Admin/Distributor).
- `GET /api/orders/myorders`: List current user's orders (Farmer).
- `POST /api/orders`: Create new order (Farmer).
- `PUT /api/orders/:id/status`: Update order status (Admin only).

### Deliveries
- `GET /api/deliveries`: List all deliveries (Admin/Distributor).
- `POST /api/deliveries`: Schedule a new delivery (Admin only).
- `PUT /api/deliveries/:id/status`: Update tracking status.

### Analytics
- `GET /api/analytics`: Real-time KPI aggregation and country performance.

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Setup**: Create a `.env` file based on `.env.example`.
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Explore API**: Visit `http://localhost:5000/api-docs` for full Swagger documentation.

---

## 📄 License & Authors

**Project Authors:**
- KIENDREBEOGO Moussa
- KYEMTORE Gloria COMPAORE Adile
- OUEDRAOGO Akram
- YAMEOGO Angeline

© 2026 AgriFlow Ecosystem. All rights reserved.
