# 🛍️ Frontend - E-Commerce App (React + Redux + MUI)

This is the **frontend** of a full-stack e-commerce web application built with **React.js**, using **Redux Toolkit** for state management and **Material UI (MUI)** for UI design.  
The app supports product browsing, search, authentication, shopping cart, order management, and admin dashboard.

---

## 🚀 Demo

🔗 [https://your-frontend-demo.vercel.app](#)

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
