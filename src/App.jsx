import "./App.css";
import { useEffect, useState } from "react";
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
import Orders from "./Pages/Orders";

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

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("shoppingWorldTheme") || "dark"
  );

  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("shoppingWorldUser");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  useEffect(() => {
    localStorage.setItem("shoppingWorldTheme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <BrowserRouter>

      <Navbar
        search={search}
        setSearch={setSearch}
        user={user}
        theme={theme}
        setTheme={setTheme}
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
          element={<Shop search={search} />}
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
            <ProtectedRoute user={user}>
              <Profile
                user={user}
                setUser={setUser}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute user={user}>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute user={user}>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute user={user}>
              <Orders />
            </ProtectedRoute>
          }
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