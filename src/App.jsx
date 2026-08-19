import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ProductDetails from "./Pages/ProductDetails";
import Shop from "./Pages/Shop";
import Profile from "./Pages/Profile";
import ForgotPassword from "./Pages/ForgotPassword";

function Home({ search, setSearch }) {
  return (
    <>
      <Hero />
      <Products search={search} />
    </>
  );
}

function App() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("shoppingWorldUser");
    return savedUser ? JSON.parse(savedUser) : null;
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
            <Home
              search={search}
              setSearch={setSearch}
            />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;