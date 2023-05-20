import * as api from "../../api/topic";

export const createTopic = (topic) => async (dispatch) => {
  try {
    const { data } = await api.createTopic(topic);
    dispatch({ type: "CREATE_TOPIC", payload: data });
  } catch (error) {
    console.error("Error:", error);
    console.error("Error Details:", error.response.data);
  }
};
