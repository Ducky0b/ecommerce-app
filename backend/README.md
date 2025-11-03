# Clothing Shop Website

## Project Description

A full-stack web application for an online clothing store where users can browse products, manage their shopping carts, place orders, and view their purchase history. The project focuses on building a modern, user-friendly e-commerce platform using the MERN stack (MongoDB, Express, React, Node.js) or another preferred technology stack.

The platform supports user authentication, product browsing by category, cart functionality, checkout process,..

## 🚀 Demo

🔗 [https://ecommerce-app-production-2e5b.up.railway.app/](#)

# User Stories

### Authentication

- [ ] As a user, I can sign in with my username and password.
- [ ] As a user, I can register for a new account with username and password.
- [ ] As a user, I can stay signed in after refreshing the page.

### Users

- [ ] I want to view a list of products categorized (shirts, pants, accessories, etc.).
- [ ] I want to search and filter products by name, category
- [ ] I want to add products to my shopping cart and adjust quantities.
- [ ] I want to register and log in to track my orders.
- [ ] I want to checkout and pay using common payment methods.

### Products

- [ ] As a user, I want to view a list of products categorized by type (e.g., shirts, pants, accessories) so that I can easily find what I’m looking for.

- [ ] As a user, I want to filter products by name, category

- [ ] As a user, I want to search for products by keyword so I can find specific items quickly.

- [ ] As a user, I want to see product details (images, price, description, sizes available) so I can decide whether to purchase.

### Cart Management

- [ ] As a user, I want to add products to my cart so I can buy them later.

- [ ] As a user, I want to view my cart to see which products I've added.

- [ ] As a user, I want to update the quantity of a product in my cart or remove it entirely.
- [ ] As a user, I want my cart to be saved across sessions after login, so I don't lose it when I refresh or return later.

### Checkout & Orders

- [ ] As a user, I want to checkout and submit my order with delivery details.

- [ ] As a user, I want to choose from available payment options.

- [ ] As a user, I want to view my order history so I can track past purchases.

- [ ] As a user, I want to track the status of my current order (e.g., Processing, Shipped, Delivered).

# API Endpoints (RESTful)

## Authentication

- [ ] `POST /auth/register` – Register a new user account.
- [ ] `POST /auth/login` – Log in and receive a token.

## Users

- [ ] `GET /users/me` – Retrieve current user information.
- [ ] `GET /users` – Get the list of users.
- [ ] `GET /users/:id` – Get single user by id.
- [ ] `PUT /users/:id` – Update a user information.
- [ ] `DELETE /users/:id` – Delete a user information.

## Categories

- [ ] `POST /categories` – Create a new category.
- [ ] `GET /categories` – Get the list of categories.
- [ ] `GET /categories/:id` – Get single category by id.
- [ ] `PUT /categorires/:id` – Update a category.
- [ ] `DELETE /categories/:id` – Delete a category.

## Products

- [ ] `POST /products` – Create a new product.
- [ ] `GET /products` – Get the list of products.
- [ ] `GET /products/:id` – Get product details.
- [ ] `PUT /products/:id` – Update a product.
- [ ] `DELETE /products/:id` – Delete a product.

## Cart

- [ ] `POST /cart` – Add an item to the cart.
- [ ] `GET /cart/:id` – Get the user's shopping cart.
- [ ] `PUT /cart/:itemId` – Update the quantity of an item in the cart.
- [ ] `DELETE /cart/:itemId` – Remove an item from the cart.

## Orders

- [ ] `POST /orders` – Create a new order from the cart.
- [ ] `GET /orders/me` – Get the current user's order history.
- [ ] `GET /orders` – Get all orders.
- [ ] `PUT /orders/:id/status` – Update status of the order .
