# 🛒 Fullstack E-Commerce App (MERN Stack)

A full-featured **E-Commerce Web Application** built with the **MERN stack** — including **user authentication, admin dashboard, cart system, and dynamic product search**.  
Deployed seamlessly across **Render (backend)** and **Netlify (frontend)**.

---

## 🧭 Overview

This project demonstrates a real-world online shopping experience where users can:

- 🛍️ Browse and filter products by category, color, and size
- 🔎 Instantly search for products via the header search bar
- 🛒 Add products to cart and place orders (Cash on Delivery)
- 👤 Register, log in, and manage personal profiles
- 🧑‍💼 Admin users can manage products, users, and orders

---

## 🌐 Live Demo

| Layer                  | URL                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Frontend (Netlify)** | [https://dulcet-khapse-41242a.netlify.app](https://dulcet-khapse-41242a.netlify.app)                           |
| **Backend (Render)**   | [https://ecommerce-app-production-2e5b.up.railway.app/](https://ecommerce-app-production-2e5b.up.railway.app/) |

---

## ⚙️ Tech Stack

| Layer           | Technologies                                    |
| --------------- | ----------------------------------------------- |
| **Frontend**    | React, Redux Toolkit, React Router, Material UI |
| **Backend**     | Node.js, Express.js, MongoDB (Mongoose), JWT    |
| **Database**    | MongoDB Atlas                                   |
| **Cloud**       | Cloudinary (image upload)                       |
| **Deploy**      | Netlify (Frontend), Render (Backend)            |
| **Other Tools** | Axios, dotenv, cors, bcrypt, multer             |

---

## 📂 Project Structure

```bash
.
├── backend/              # Node.js + Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/             # React app (Redux, MUI, Routing)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md             # Root documentation (this file)
```

# 🚀 How to Clone and Run Locally

## 1️⃣ Clone the repository

- git clone https://github.com/yourusername/ecommerce-app.git
- cd ecommerce-app

## 2️⃣ Install dependencies

Backend:

- cd backend
- npm install

Frontend:

- cd ../frontend
- npm install

## 3️⃣ Set up environment variables

🧩 Backend .env

- PORT=5000
- MONGODB_URI=your_mongo_connection_string
- JWT_SECRET=your_secret_key
- CLOUDINARY_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret
- CLIENT_URL=http://localhost:3000

🧩 Frontend .env

For Vite:

VITE_API_URL=http://localhost:5000

For Create React App:

REACT_APP_API_URL=http://localhost:5000

## 4️⃣ Start the servers

Backend:

- cd backend
- npm run dev

Frontend:

- cd ../frontend
- npm start

App will run at:

Frontend: 👉 http://localhost:3000

Backend API: 👉 http://localhost:5000

# 🎓 What I Learned

- Designing a scalable MERN project structure

- Handling JWT-based authentication and authorization

- Solving CORS deployment issues between Render and Netlify

- Optimizing state management with Redux Toolkit

- Deploying production-grade apps to Render & Netlify

- Using Cloudinary API for image storage

# 🔮 Future Improvements

- Integrate payment gateway (Stripe or PayPal)

- Product reviews and ratings

- Admin analytics dashboard

- Multi-language support (EN/VN)

- Dark mode toggle

# 🙏 Acknowledgements

Inspired by Shopee & Tiki

Thanks to Material UI, Redux Toolkit, and the MERN community

Deployed with Render + Netlify

# 🧑‍💻 Author

Vo Van Viet

- 📧 vanviet28052002@gmail.com
- [![Facebook](https://img.shields.io/badge/Facebook-1877F2?logo=facebook&logoColor=white)](https://facebook.com/bedittihon)
