# 🛍️ Go shop — Multi-Vendor Marketplace

> **Go shop** is a full-stack (MERN) marketplace where independent sellers open their own shop, list products, and shoppers browse everything in one beautiful storefront — with an **Admin** who approves sellers and keeps the platform clean.

Built as a real-world, role-based product: **Shopper → Vendor → Admin**, each with its own experience, secured by JWT.

---

## 💡 The Idea

Small sellers want to sell online but can't build a website. Shoppers don't trust unknown shops.
**Go shop solves both:**

1. A seller signs up and creates a shop.
2. The **admin reviews and approves** the seller (trust & quality control).
3. Approved sellers add products from their dashboard.
4. Only **active products from approved sellers** appear on the public storefront.

---

## ✨ Features

| Role | What they can do |
|---|---|
| 🛒 **Shopper** (no login) | Browse products, search, filter by category, sort by price, save to wishlist, add to cart |
| 🏪 **Vendor** | Sign up, see approval status, add / edit / delete **own** products, track stock |
| 🛡️ **Admin** | Dashboard stats, approve / block / delete vendors, hide or delete any product |

**UI / UX highlights:** premium indigo + coral theme, floating 3D-style icons, glass navbar with live search, login/sign-up **popup with close button**, **field-level error messages**, toast notifications, skeleton loaders, smooth animations, fully responsive.

---

## 🧰 Tech Stack

- **Frontend:** React 18, Vite, React Router, plain CSS (no UI library)
- **Backend:** Node.js, Express 5
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (7-day expiry) + bcrypt password hashing
- **Access control:** role middleware (`protect`, `allow`)

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@infyle.com` | `Admin@123` |
| **Vendor** (approved, has products) | `vendor@infyle.com` | `Vendor@123` |

> Both accounts are created by `npm run seed`. You can also sign up as a new vendor and approve it from the admin panel to see the full flow.

---

## 🚀 Run Locally

**Prerequisites:** Node 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1) Backend
cd backend
npm install
cp .env.example .env     # edit MONGO_URI / JWT_SECRET if needed
npm run seed             # creates admin, demo vendor and sample products
npm run dev              # API on http://localhost:5000

# 2) Frontend (new terminal)
cd frontend
npm install
npm run dev              # App on http://localhost:5173
```

**Backend `.env`**

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/man_stack_marketplace
JWT_SECRET=change_this_to_a_long_random_text
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@infyle.com
ADMIN_PASSWORD=Admin@123
```

**Frontend `.env`** (optional) → `VITE_API_URL=http://localhost:5000`

---

## 🔄 How It Works

```
Vendor signs up ──► status: pending ──► Admin approves ──► status: approved
                                                              │
                                  Vendor adds products ◄──────┘
                                              │
              Public storefront shows only: active product + approved vendor
```

- **pending** vendors can log in but cannot add products ("Your shop is waiting for admin approval").
- **blocked** vendors cannot log in, and their existing session is rejected.
- A vendor can only edit or delete **their own** products (ownership is enforced in the database query).
- Deleting a vendor also deletes all of their products.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api` · Protected routes need the header `Authorization: Bearer <token>`

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Vendor sign up. Body: `name, shopName, email, password` → returns `token` + `user` |
| POST | `/login` | Public | Body: `email, password` → returns `token` + `user` |
| GET | `/me` | Logged in | Returns the current user (used to refresh approval status) |

### Products — `/api/products`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | All visible products (active + approved vendor), newest first |
| GET | `/mine` | Vendor | Logged-in vendor's own products |
| POST | `/` | Approved vendor | Create product. Body: `title, price` (required), `description, category, image, stock` |
| PUT | `/:id` | Approved vendor | Update own product |
| DELETE | `/:id` | Vendor | Delete own product |

### Admin — `/api/admin` (admin only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Totals: vendors, pending vendors, products, active products |
| GET | `/vendors` | All vendors with their product count |
| PATCH | `/vendors/:id/status` | Body: `{ "status": "pending" \| "approved" \| "blocked" }` |
| DELETE | `/vendors/:id` | Delete vendor and all their products |
| GET | `/products` | Every product on the platform |
| PATCH | `/products/:id/toggle` | Show / hide a product |
| DELETE | `/products/:id` | Delete any product |

### Error format

Errors return a clear message, and form errors also say which field is wrong, so the UI can highlight it:

```json
{ "field": "email", "message": "No account found with this email. Please sign up first." }
```

| Code | Meaning |
|---|---|
| 400 | Validation error (missing / invalid field) |
| 401 | Not logged in, wrong password or expired session |
| 403 | No permission (wrong role, unapproved or blocked account) |
| 404 | Not found |
| 409 | Email already registered |

### Quick test with cURL

```bash
# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@infyle.com","password":"Admin@123"}'

# Use the returned token
curl http://localhost:5000/api/admin/stats -H "Authorization: Bearer <token>"
```

---

## 📁 Project Structure

```
├── backend
│   ├── server.js            # Express app, CORS, error handler, DB connect
│   ├── seed.js              # Creates admin, demo vendor, sample products
│   ├── models/              # User.js, Product.js
│   ├── middleware/auth.js   # protect (JWT) + allow (roles)
│   └── routes/              # auth.js, products.js, admin.js
└── frontend/src
    ├── App.jsx              # Routes + role-protected pages
    ├── AuthContext.jsx      # Login state & token handling
    ├── Ui.jsx               # Toasts, cart/wishlist, login-popup state
    ├── api.js               # Fetch helper (adds token, friendly errors)
    ├── components/          # Navbar, AuthModal, ProductCard, Icons3D
    └── pages/               # Home, VendorDashboard, AdminDashboard
```

---

## 🔒 Security & Quality

- Passwords hashed with **bcrypt**; sessions use signed **JWT** with expiry
- **Role-based access** on every private route; vendors can only touch their own data
- Server-side validation on all inputs (the frontend validates too, for instant feedback)
- CORS restricted to the configured frontend URL(s)
- Central error handler — no stack traces leak to the client

## 🔭 Future Scope

Cart & checkout with payments, order management for vendors, product reviews and ratings, image upload, pagination, and email notifications on approval.

---

Made with ❤️ for the Infyle assignment.
