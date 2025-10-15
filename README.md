# 🛒 FreshMart Supermarket

**FreshMart Supermarket** is a full-stack MERN-style eCommerce web application that allows users to browse fresh products, add them to a shopping cart, and place orders securely.  
It supports **customer** and **admin roles**, real-time order updates, and is fully hosted on **Zoho Catalyst**.

---

## 🚀 Features

- 🧑‍💻 User Registration & Login with JWT Authentication  
- 👑 Role-based Access (Admin / Customer)  
- 🛍️ Product Listing, Filtering, and Search  
- 🛒 Shopping Cart and Secure Checkout  
- 📦 Order Management with Live Status  
- 📊 Admin Dashboard for Products and Orders  
- 🔒 Data Validation and Middleware Security  
- ☁️ Deployment on Backend Zoho Catalyst AppSail and Frontend Zoho Catalyst Client Web Hosting

---

## 🧱 Folder Structure

```
catalyst/
│
├── appsail/                     # Backend (Node.js + Express + MySQL)
│   ├── certs/                   # SSL certificates (for secure DB connection)
│   │   └── ca.pem
│   ├── config/                  # Config files
│   │   ├── database.js          # Database connection
│   │   └── dbSchema.sql         # MySQL schema
│   ├── controller/              # Business logic for routes
│   │   ├── authController.js
│   │   ├── OrderController.js
│   │   └── productController.js
│   ├── middleware/              # Authentication & validation
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/                  # Database model queries
│   │   ├── Order.js
│   │   ├── OrderDetail.js
│   │   ├── OrderItem.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/                  # Express API routes
│   │   ├── auth.js
│   │   ├── index.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── utils/                   # Helper utilities & JWT
│   │   ├── authUtils.js
│   │   └── helper.js
│   ├── .env                     # Backend environment variables
│   ├── app.js                   # Express app setup
│   ├── index.js                 # Backend entry file
│   ├── package.json             # Backend dependencies
│   └── package-lock.json
│
├── client/                      # Frontend (React + Bootstrap)
│   ├── build/                   # Production build output
│   │   ├── static/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── public/                  # Static public assets
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── config/              # Environment config (API base URL)
│   │   ├── context/             # React Context API (Auth, Cart)
│   │   ├── Pages/               # App pages
│   │   ├── services/            # Axios API services
│   │   ├── App.js               # Root component
│   │   └── index.js             # React entry point
│   ├── .env                     # Frontend environment variables
│   ├── package.json             # Frontend dependencies
│   └── README.md
│
├── .catalystrc                  # Catalyst runtime config
├── catalyst.json                # Catalyst project metadata
├── app-config.json              # Catalyst AppSail app configuration
├── catalyst-debug.log           # Catalyst debug logs
└── README.md                    # Main project documentation
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, Bootstrap, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL  |
| **Auth** | JWT (JSON Web Tokens) |
| **Deployment** | Zoho Catalyst |
| **Security** | Helmet, bcrypt, express-validator |
| **Environment** | `.env` for client & server |

---

## ⚙️ Development Setup

### 1️⃣ Prerequisites

- Node.js (v18 or newer)  
- npm (v9 or newer)    
- Zoho Catalyst CLI → `npm install -g zcatalyst-cli`

---

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd appsail

# Install dependencies
npm install

# Configure environment variables
# Create a .env file in appsail/
```

Example `.env` file:

```ini
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=freshmart
JWT_SECRET=your_jwt_secret
```

Run backend locally:

```bash
npm start
```

Backend runs on:  
👉 **http://localhost:3001**

---

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend
cd ../client

# Install dependencies
npm install

# Configure environment
# Create .env.development
```

Example `.env.development`:

```bash
REACT_APP_API_URL=http://localhost:3001/api
```

Run frontend:

```bash
npm start
```

Frontend runs on:  
👉 **http://localhost:3000**

---

### 4️⃣ CORS Configuration

Ensure backend `app.js` allows your frontend origin:

```js
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
```

---

## ☁️ Production Deployment (Zoho Catalyst AppSail)

### 1️⃣ Build Frontend for Production

```bash
cd client
npm run build
```

This generates `/client/build` for deployment.

---

### 2️⃣ Deploy Backend via Catalyst CLI

```bash
# Login
zcatalyst login

# Navigate to root folder
cd D:\catalyst

# Deploy to AppSail
zcatalyst deploy appsail
```

---

### 3️⃣ Set Environment Variables in Catalyst Console

In **Catalyst → AppSail → Environment Variables**, add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | production |
| `DB_HOST` | your_db_host |
| `DB_USER` | catalyst_user |
| `DB_PASSWORD` | catalyst_password |
| `DB_NAME` | supermarket_db |
| `JWT_SECRET` | your_secret_key |
| `CLIENT_URL` | https://your-frontend-url |

---

### 4️⃣ Production URLs
**Sample URL**

| Service | URL |
|---------|-----|
| **Frontend** | https://supermarketwebapp-973279339468.development.catalystserverless.in |
| **Backend** | https://server-6428328648794.development.catalystappsail.in/api |

---

---

## 🧑‍💼 Admin Dashboard

Login using an admin account to access:  
👉 **/admin**

**Admin Features:**

- Manage products (Add, Edit, Delete)
- Manage orders and update statuses
- View customer details

---

## 📚 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/products` | Fetch all products |
| GET | `/api/orders` | Fetch user orders |
| POST | `/api/orders` | Create a new order |
| PUT | `/api/orders/:id/status` | Update order status (Admin only) |

---

## 📦 Build Commands Summary

| Command | Description |
|---------|-------------|
| `npm start` | Run backend server |
| `npm run dev` | Run frontend in dev mode |
| `npm run build` | Build frontend for production |
| `zcatalyst deploy appsail` | Deploy full project to Zoho Catalyst |

---

## 👨‍💻 Author

**Developer:** Tm  
**Project:** FreshMart Supermarket  
**Platform:** Zoho Catalyst  
**Year:** 2025