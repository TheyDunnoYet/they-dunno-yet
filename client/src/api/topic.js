import axios from "axios";

const BASE_URL = "http://localhost:5001/api/topic";

const API = axios.create({ baseURL: BASE_URL });

// Interceptor
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
  config.headers["x-auth-token"] = token ? `${token}` : "";
  config.headers["Content-type"] = "application/json";
  return config;
});

export const fetchTopic = async (topicId) => {
  try {
    const { data } = await API.get(`/${topicId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createTopic = async (topic) => {
  try {
    const { data } = await API.post("/", topic);
    return data;
  } catch (error) {
    throw error;
  }
};
