import React, { useEffect } from "react";
import {
  useLocation,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./redux/actions/authActions";
import { getFeeds } from "./redux/actions/feedActions";
import { getTopics } from "./redux/actions/topicActions";
import { getProducts } from "./redux/actions/productActions";
import { getBlockchains } from "./redux/actions/blockchainActions";
import { getMarketplaces } from "./redux/actions/marketplaceActions";
import { getTags } from "./redux/actions/tagActions";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import ProductsPage from "./components/ProductsPage";
import Login from "./components/Login";
import Register from "./components/Register";
import io from "socket.io-client";
import ProductModal from "./components/ProductModal";

// Establish socket connection
const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5001");

const RoutesWrapper = () => {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:productId" element={<ProductModal />} />
      </Routes>
      {location.state?.modal && <ProductModal />}
    </>
  );
};

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
      dispatch(getBlockchains());
      dispatch(getMarketplaces());
    }

    const listenToEvent = (eventName, action) => {
      socket.on(eventName, () => {
        dispatch(action());
      });
    };

    // Listen to 'feedCreated', 'feedUpdated' and 'feedDeleted' events from the server
    ["feedCreated", "feedUpdated", "feedDeleted"].forEach((event) =>
      listenToEvent(event, getFeeds)
    );

    // Listen to 'topicCreated', 'topicUpdated' and 'topicDeleted' events from the server
    ["topicCreated", "topicUpdated", "topicDeleted"].forEach((event) =>
      listenToEvent(event, getTopics)
    );

    // Listen to 'productCreated', 'productUpdated' and 'productDeleted' events from the server
    ["productCreated", "productUpdated", "productDeleted"].forEach((event) =>
      listenToEvent(event, getProducts)
    );

    // Listen to 'blockchainCreated', 'blockchainUpdated' and 'blockchainDeleted' events from the server
    ["blockchainCreated", "blockchainUpdated", "blockchainDeleted"].forEach(
      (event) => listenToEvent(event, getBlockchains)
    );

    // Listen to 'marketplaceCreated', 'marketplaceUpdated' and 'marketplaceDeleted' events from the server
    ["marketplaceCreated", "marketplaceUpdated", "marketplaceDeleted"].forEach(
      (event) => listenToEvent(event, getMarketplaces)
    );

    // Clean up the effect
    return () => socket.disconnect();
  }, [dispatch]);

  return (
    <Router>
      <NavBar />
      <RoutesWrapper />
    </Router>
  );
}

export default App;
