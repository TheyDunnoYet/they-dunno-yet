import axios from "axios";

const BASE_URL = "http://localhost:5001/api/tag";

const API = axios.create({ baseURL: BASE_URL });

// Interceptor
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
  config.headers["x-auth-token"] = token ? `${token}` : "";
  config.headers["Content-type"] = "application/json";
  return config;
});

export const fetchTag = async (tagId) => {
  try {
    const { data } = await API.get(`/${tagId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllTags = async () => {
  try {
    const { data } = await API.get("/");
    return data;
  } catch (error) {
    throw error;
  }
};

export const createTag = async (tag) => {
  try {
    const { data } = await API.post("/", tag);
    return data;
  } catch (error) {
    throw error;
  }
};
