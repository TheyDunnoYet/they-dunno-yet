import axios from "axios";

// Base URL for our backend server
const BASE_URL = "http://localhost:5001/api/auth";

const API = axios.create({ baseURL: BASE_URL });

// Send a POST request to the login endpoint with user credentials
export const loginUser = async (userCredentials, stayLogged) => {
  try {
    const { data } = await API.post("/login", {
      ...userCredentials,
      stayLogged,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// Send a POST request to the register endpoint with user data
export const registerUser = async (userData) => {
  try {
    const { data } = await API.post("/register", userData);
    return data;
  } catch (error) {
    throw error;
  }
};

// Send a GET request to fetch the logged in user
export const fetchCurrentUser = async (token) => {
  try {
    API.defaults.headers.common["x-auth-token"] = token;
    const { data } = await API.get("/user");
    return data;
  } catch (error) {
    throw error;
  }
};
