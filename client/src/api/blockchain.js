import axios from "axios";

const BASE_URL = "http://localhost:5001/api/blockchain";

const API = axios.create({ baseURL: BASE_URL });

// Interceptor
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
  config.headers["x-auth-token"] = token ? `${token}` : "";
  config.headers["Content-type"] = "application/json";
  return config;
});

export const fetchBlockchain = async (blockchainId) => {
  try {
    const { data } = await API.get(`/${blockchainId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllBlockchains = async () => {
  try {
    const { data } = await API.get("/");
    return data;
  } catch (error) {
    throw error;
  }
};

export const createBlockchain = async (blockchain) => {
  try {
    const { data } = await API.post("/", blockchain);
    return data;
  } catch (error) {
    throw error;
  }
};
