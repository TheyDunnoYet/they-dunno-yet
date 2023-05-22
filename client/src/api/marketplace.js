import axios from "axios";

const BASE_URL = "http://localhost:5001/api/marketplace";

const API = axios.create({ baseURL: BASE_URL });

// Interceptor
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
  config.headers["x-auth-token"] = token ? `${token}` : "";
  config.headers["Content-type"] = "application/json";
  return config;
});

export const fetchMarketplace = async (marketplaceId) => {
  try {
    const { data } = await API.get(`/${marketplaceId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllMarketplaces = async () => {
  try {
    const { data } = await API.get("/");
    return data;
  } catch (error) {
    throw error;
  }
};

export const createMarketplace = async (marketplace) => {
  try {
    const { data } = await API.post("/", marketplace);
    return data;
  } catch (error) {
    throw error;
  }
};
