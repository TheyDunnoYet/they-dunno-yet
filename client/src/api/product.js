import axios from "axios";

const BASE_URL = "http://localhost:5001/api/product";

const API = axios.create({ baseURL: BASE_URL });

// Interceptor
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
  config.headers["x-auth-token"] = token ? `${token}` : "";
  config.headers["Content-type"] = "application/json";
  return config;
});

export const addProduct = async (product) => {
  try {
    const { data } = await API.post("/", product);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllProducts = async () => {
  try {
    const { data } = await API.get("/");
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchProduct = async (productId) => {
  try {
    const { data } = await API.get(`/${productId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllBlockchains = async () => {
  try {
    const { data } = await API.get("/blockchains");
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllMarketplaces = async () => {
  try {
    const { data } = await API.get("/marketplaces");
    return data;
  } catch (error) {
    throw error;
  }
};
