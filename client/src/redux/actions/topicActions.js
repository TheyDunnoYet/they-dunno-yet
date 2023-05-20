import * as api from "../../api/topic";

export const GET_TOPICS = "GET_TOPICS";
export const TOPICS_LOADING = "TOPICS_LOADING";

// Fetch all topics
export const getTopics = () => async (dispatch) => {
  dispatch(setTopicsLoading());
  try {
    const data = await api.fetchAllTopics();
    dispatch({ type: GET_TOPICS, payload: data });
  } catch (error) {
    console.error("Error:", error);
    console.error("Error Details:", error.response);
  }
};

// Create topic
export const createTopic = (topic) => async (dispatch) => {
  try {
    const { data } = await api.createTopic(topic);
    dispatch({ type: "CREATE_TOPIC", payload: data });
  } catch (error) {
    console.error("Error:", error);
    console.error("Error Details:", error.response.data);
  }
};

// Topics loading
export const setTopicsLoading = () => {
  return {
    type: TOPICS_LOADING,
  };
};
