import { GET_TOPICS, TOPICS_LOADING } from "../actions/topicActions";

const initialState = {
  topics: [],
  loading: false,
};

const topicReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TOPICS:
      return {
        ...state,
        topics: action.payload,
        loading: false,
      };
    case TOPICS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case "CREATE_TOPIC":
      return {
        ...state,
        topics: [...state.topics, action.payload],
      };
    default:
      return state;
  }
};

export default topicReducer;
