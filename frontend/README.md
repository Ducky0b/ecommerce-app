# 🛍️ Frontend - E-Commerce App (React + Redux + MUI)

This is the **frontend** of a full-stack e-commerce web application built with **React.js**, using **Redux Toolkit** for state management and **Material UI (MUI)** for UI design.  
The app supports product browsing, search, authentication, shopping cart, order management, and admin dashboard.

---

## 🧭 Project Overview

This e-commerce app allows users to:

- 🛍️ Browse products by category, color, and size
- 🔎 Search products instantly from the top navigation bar
- 🛒 Add products to cart and place orders (COD supported)
- 👤 Manage personal account, upload avatar, and view order history
- 🧑‍💼 Admin dashboard for managing products, users, and orders

## 🚀 Demo

🔗 [https://dulcet-khapse-41242a.netlify.app/](#)

---

## 🧩 Features

### 👤 User

- Register, login, and authenticate with JWT
- Update profile and upload avatar
- View order history

### 🛒 Cart & Orders

- Add / remove products from cart
- Update item quantity and auto-calculate totals
- Place orders (COD)
- View order confirmation details

### 🛍️ Products

- Browse by category and subcategory
- **Dynamic Search Bar** on AppBar
- Product variants: color, size, stock
- “All Products” page to view every item

### 🧑‍💼 Admin Dashboard

- Manage products, users, and orders
- CRUD operations for categories and variants
- Manage inventory and view analytics (coming soon)

---

## ⚙️ Tech Stack

| Technology                | Description                                   |
| ------------------------- | --------------------------------------------- |
| **React.js (v18)**        | Frontend library for building interactive UIs |
| **Redux Toolkit**         | State management and async API handling       |
| **React Router DOM (v6)** | Client-side routing                           |
| **Material UI (MUI)**     | Component library for responsive design       |
| **Axios**                 | API request handling                          |
| **React Hook Form + Yup** | Form management and validation                |
| **Cloudinary**            | Image upload and hosting                      |
| **JWT Auth**              | JSON Web Token-based authentication           |
| **Vite / CRA**            | Bundler (depending on your setup)             |

---

## 📂 Project Structure

```bash
frontend/
├── src/
│   ├── app/                 # Redux store and API service configuration
│   ├── components/          # Reusable UI components (Form, Upload, SearchInput,…)
│   ├── features/            # Redux slices: user, product, cart, order, category
│   ├── hooks/               # Custom hooks (e.g., useAuth)
│   ├── pages/               # Main pages (Home, Products, Search, Profile,…)
│   ├── utils/               # Utilities: slugify, numberFormat, etc.
│   ├── App.js               # Main routing file
│   ├── main.jsx             # App entry point
│   └── index.css
│
├── public/
│   └── index.html
│
└── package.json
```

## 🎓 What I Learned

Building this project taught me how to:

- Design a full MERN architecture from scratch
- Implement secure JWT authentication and authorization
- Handle Cloudinary integration for product and user images
- Manage complex UI state using Redux Toolkit
- Fix CORS and deploy fullstack apps across Netlify + Render
- Apply responsive design with Material UI

---
