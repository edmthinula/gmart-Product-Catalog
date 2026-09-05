# Gmart Product Catalog & Inventory Management

A full-stack internal admin dashboard for managing product categories and inventory stock.

## Prerequisites
- Node.js (v18+)
- MySQL Server running on port 3306

## 1. Database Setup
Create an empty MySQL database named `gmart_product_catalog` before proceeding.

## 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   `cd backend`
2. Install dependencies:
   `npm install`
3. Create a `.env` file in the `backend` folder with the following:
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=gmart_product_catalog
   JWT_SECRET=super_secret_gmart_key_2026
4. Run migrations to build the database schema:
   `npx knex migrate:latest`
5. Run the seed file to create the default admin user:
   `npx knex seed:run`
6. Start the server (runs on http://localhost:5000):
   `npm run dev`

## 3. Frontend Setup
1. Open a second terminal and navigate to the frontend folder:
   `cd frontend`
2. Install dependencies:
   `npm install`
3. Start the Vite development server:
   `npm run dev`

## Default Admin Credentials
- **Email:** admin@gmart.com
- **Password:** admin123