# Man Stack Marketplace (MERN)

A simple marketplace with a public shop page, a **Vendor dashboard** and an **Admin dashboard**.

**Stack:** MongoDB, Express 5, React (Vite), Node.js. Login uses JWT.

## How it works
- A vendor signs up. Status is `pending`.
- Admin approves the vendor. Now the vendor can add, edit and delete products.
- The public shop shows only products that are **live** and from **approved** vendors.
- Admin can approve or block vendors, hide or delete any product, and delete vendors.

## Run on your computer
You need Node 18+ and MongoDB (local, or a free Atlas cluster).

```bash
# 1) Backend
cd backend
npm install
# .env is already created. Change MONGO_URI and JWT_SECRET if needed.
npm run seed      # creates admin + demo vendor + products (run once)
npm run dev       # http://localhost:5000

# 2) Frontend (new terminal)
cd frontend
npm install
npm run dev       # http://localhost:5173
```

Demo logins (from the seed):
- Admin: `admin@manstack.com` / `Admin@123`
- Vendor: `vendor@manstack.com` / `Vendor@123`

## Folder guide
```
backend/
  server.js            app start, DB connection
  models/              User, Product (Mongoose)
  middleware/auth.js   protect (login check) + allow (role check)
  routes/auth.js       register, login, me
  routes/products.js   public list + vendor CRUD
  routes/admin.js      stats, vendors, products (admin only)
  seed.js              first admin + demo data
frontend/src/
  api.js               one fetch helper (adds token)
  AuthContext.jsx      login state for the whole app
  pages/               Home, Auth, VendorDashboard, AdminDashboard
  components/          Navbar, ProductCard, Stat, Toast, Img
```

## Deploy

### 1) Database: MongoDB Atlas
Create a free cluster, add a database user, allow access from anywhere (0.0.0.0/0), copy the connection string.

### 2) Backend on Render
- New > Web Service > connect your GitHub repo
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL, add after step 3), `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- Run the seed once on your computer with the Atlas `MONGO_URI` in `backend/.env`: `npm run seed`

### 3) Frontend on Vercel
- New Project > import the repo
- Root Directory: `frontend` (Framework: Vite)
- Environment variable: `VITE_API_URL` = your Render URL (no trailing slash)
- Deploy, then go back to Render and set `CLIENT_URL` to the Vercel URL. Redeploy the backend.

Note: Render free plan sleeps after some idle time, so the first request can take about 30 seconds.
