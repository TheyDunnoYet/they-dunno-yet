import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./redux/actions/authActions";
import { getFeeds } from "./redux/actions/feedActions";
import { getTags } from "./redux/actions/tagActions";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import ProductsPage from "./components/ProductsPage";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      localStorage.getItem("jwtToken") ||
      sessionStorage.getItem("jwtToken")
    ) {
      dispatch(getCurrentUser());
      dispatch(getFeeds());
      dispatch(getTags());
    }
  }, [dispatch]);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
