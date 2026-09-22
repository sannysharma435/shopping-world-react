import "./App.css";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ShoppingAI from "./components/ShoppingAI";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ProductDetails from "./Pages/ProductDetails";
import Shop from "./Pages/Shop";
import Categories from "./Pages/Categories";
import Contact from "./Pages/Contact";
import Profile from "./Pages/Profile";
import ForgotPassword from "./Pages/ForgotPassword";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/Wishlist";

import AdminLogin from "./Pages/AdminLogin";
import AdminOrders from "./Pages/AdminOrders";

function AdminProtectedRoute() {
  const isAdmin =
    localStorage.getItem("shoppingWorldAdmin") === "true";

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminOrders />;
}

function App() {
  const [search, setSearch] = useState("");

  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("shoppingWorldUser");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  return (
    <BrowserRouter>

      <Navbar
        search={search}
        setSearch={setSearch}
        user={user}
      />

      <Routes>

        <Route
          path="/"
          element={
            <Home search={search} />
          }
        />

        <Route
          path="/product/:name"
          element={<ProductDetails />}
        />

        <Route
          path="/shop"
          element={<Shop />}
        />

        <Route
          path="/categories"
          element={<Categories />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/profile"
          element={
            <Profile
              user={user}
              setUser={setUser}
            />
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/orders"
          element={<AdminProtectedRoute />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

      <ShoppingAI />

    </BrowserRouter>
  );
}

export default App;