# Enterprise Mini ERP + CRM Operations Portal

A complete, production-grade enterprise Mini ERP + CRM Portal built with **Node.js 22, Express 5, TypeScript, Prisma ORM, PostgreSQL, React 19, Vite, Tailwind CSS, Redux Toolkit, Framer Motion, and Chart.js**.

---

## Features Architecture

- 🔐 **Authentication & RBAC**: JWT Access & HttpOnly Refresh Token flow, BCrypt password hashing, role permissions (`ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`).
- 👥 **CRM Customer Management**: Lead pipeline tracking, follow-up scheduling, GST validation, customer categories (Retail, Wholesale, Distributor).
- 📦 **Inventory & Stock Management**: Real-time stock audit trail (`IN`, `OUT`, `ADJUSTMENT`, `TRANSFER`), minimum stock alerts, automatic stock reserve/deduction logic.
- 📜 **Sales Challan Module**: Unique challan code generation (`CH-YYYYMMDD-XXXX`), line-item snapshots, confirmation stock deduction, PDF generation & printing.
- 🧾 **Invoicing & Billing**: One-click Invoice creation (`INV-YYYYMMDD-XXXX`), tax & discount logic, paid/unpaid status tracker, PDF download.
- 📊 **Executive Dashboard**: Live revenue metrics, monthly charts (Chart.js), top products, recent activity audit logs.
- 🎨 **Modern Design System**: Sleek glassmorphism visual identity, smooth framer-motion micro-interactions, full Dark & Light mode toggle.

---
## 🌐 Live Demo

- **Frontend (Netlify):**
  https://erpmanagmentlive.netlify.app/

- **Backend API (Render):**
  https://fullstacktask-heeloworld-s.onrender.com

- **API Documentation (Swagger):**
  https://fullstacktask-heeloworld-s.onrender.com/api-docs

## Tech Stack Summary

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, Vite, JavaScript, Redux Toolkit, Redux Persist, Tailwind CSS, Framer Motion, React Icons, React Hot Toast, Chart.js, React Chartjs 2, React Hook Form, Yup |
| **Backend** | Node.js 22 LTS, Express.js 5, TypeScript, Prisma ORM, PostgreSQL 16, JWT, Bcrypt, Multer, Cloudinary, Helmet, Rate Limiter, Swagger UI, Jest |
| **DevOps** | Docker, Docker Compose, Vercel, Render, Neon PostgreSQL, GitHub Actions |

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 22 LTS
- PostgreSQL 16 database running locally or Neon DB connection string

### 1. Clone & Install Dependencies
```bash
# Install root monorepo tooling
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in `backend/` and `frontend/`:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Initialize Database & Seed Data
```bash
cd backend
npx prisma db push
npx prisma db seed
```

Default Seed Credentials:
- **Admin**: `admin@erp.com` / `Admin@123456`
- **Sales**: `sales@erp.com` / `Sales@123456`
- **Warehouse**: `warehouse@erp.com` / `Warehouse@123456`
- **Accounts**: `accounts@erp.com` / `Accounts@123456`

### 4. Run Development Servers
From project root:
```bash
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Swagger Documentation: `http://localhost:5000/api-docs`

---

## Docker Execution

```bash
docker-compose up --build
```

---

## Project Structure

```
.
├── backend/
│   ├── prisma/             # Database Schema & Seed scripts
│   ├── src/
│   │   ├── config/         # Environment & Cloudinary setup
│   │   ├── constants/      # App constants & Roles
│   │   ├── controllers/    # API Controllers
│   │   ├── middleware/     # Auth, RBAC, Rate Limiter, Error handler
│   │   ├── repositories/   # Prisma Data Layer Repositories
│   │   ├── routes/         # Express API Routes
│   │   ├── services/       # Core Business Logic & PDF generator
│   │   ├── utils/          # Token, Hash, Logger, Custom ApiErrors
│   │   └── validators/     # Express Validator schemas
│   └── tests/              # Jest integration tests
└── frontend/
    └── src/
        ├── components/     # UI Design System & Reusable Components
        ├── context/        # Dark/Light Theme Context
        ├── hooks/          # Custom hooks
        ├── layouts/        # Dashboard & Auth Layouts
        ├── pages/          # Full ERP Pages
        ├── redux/          # Redux Toolkit Slices & Store
        └── services/       # Axios API integration
```
