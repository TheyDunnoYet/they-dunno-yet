import axios from "axios";

const BASE_URL = "http://localhost:5001/api/topic";

const API = axios.create({ baseURL: BASE_URL });

export const fetchTopic = async (topicId) => {
  try {
    const { data } = await API.get(`/${topicId}`);
    return data;
  } catch (error) {
    throw error;
  }
};
