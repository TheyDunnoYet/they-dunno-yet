import axios from "axios";

const BASE_URL = "http://localhost:5001/api/feed";

const API = axios.create({ baseURL: BASE_URL });

// Interceptor
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
  config.headers["x-auth-token"] = token ? `${token}` : "";
  config.headers["Content-type"] = "application/json";
  return config;
});

export const fetchFeed = async (feedId) => {
  try {
    const { data } = await API.get(`/${feedId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllFeeds = async () => {
  try {
    const { data } = await API.get("/");
    return data;
  } catch (error) {
    throw error;
  }
};

export const createFeed = async (feed) => {
  try {
    const { data } = await API.post("/", feed);
    return data;
  } catch (error) {
    throw error;
  }
};
