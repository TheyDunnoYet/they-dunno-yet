import axios from "axios";

const BASE_URL = "http://localhost:5001/api/feed";

const API = axios.create({ baseURL: BASE_URL });

export const fetchFeed = async (feedId) => {
  try {
    const { data } = await API.get(`/${feedId}`);
    return data;
  } catch (error) {
    throw error;
  }
};
