import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
// import AccountPage from "../pages/AccountPage";
// import UserProfilePage from "../pages/UserProfilePage";
import BlankLayout from "../layouts/BlankLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import AuthRequire from "./AuthRequire";
import ProductDetailPage from "../pages/ProductDetailPage";
import AdminDashboard from "../admin/AdminDashboard";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import ProductList from "../features/product/ProductList";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import AccountPage from "../pages/AccountPage";
import AllProductPage from "../pages/AllProductPage";
import AdminRequire from "./AdminRequire";
import OrderManagement from "../features/order/OrderManagement";
function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          // <AuthRequire>
          <MainLayout />
          // </AuthRequire>
        }
      >
        <Route index element={<HomePage />} />
        <Route
          path="/admin"
          element={
            <AdminRequire>
              <AdminDashboard />
            </AdminRequire>
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/order" element={<OrderManagement />} />

        <Route path="/products/all" element={<AllProductPage />} />
        <Route path="/products/:parentSlug" element={<ProductPage />} />
        <Route
          path="/products/:parentSlug/:childSlug"
          element={<ProductPage />}
        />

        <Route
          path="/products/detail/:slugAndId"
          element={<ProductDetailPage />}
        />

        <Route path="/cart" element={<CartPage />} />
      </Route>

      <Route element={<BlankLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
