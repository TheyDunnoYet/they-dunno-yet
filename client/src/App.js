import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./redux/actions/authActions";
import { getFeeds } from "./redux/actions/feedActions";
import { getTopics } from "./redux/actions/topicActions";
import { getProducts } from "./redux/actions/productActions";
import { getTags } from "./redux/actions/tagActions";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import ProductsPage from "./components/ProductsPage";
import Login from "./components/Login";
import Register from "./components/Register";
import io from "socket.io-client";

// Establish socket connection
const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5001");

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      localStorage.getItem("jwtToken") ||
      sessionStorage.getItem("jwtToken")
    ) {
      dispatch(getCurrentUser());
      dispatch(getFeeds());
      dispatch(getTopics());
      dispatch(getProducts());
      dispatch(getTags());
    }

    // Listen to 'feedCreated', 'feedUpdated' and 'feedDeleted' events from the server
    socket.on("feedCreated", () => {
      dispatch(getFeeds());
    });

    socket.on("feedUpdated", () => {
      dispatch(getFeeds());
    });

    socket.on("feedDeleted", () => {
      dispatch(getFeeds());
    });

    // Listen to 'topicCreated', 'topicUpdated' and 'topicDeleted' events from the server
    socket.on("topicCreated", () => {
      dispatch(getTopics());
    });

    socket.on("topicUpdated", () => {
      dispatch(getTopics());
    });

    socket.on("topicDeleted", () => {
      dispatch(getTopics());
    });

    // Clean up the effect
    return () => socket.disconnect();
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
