import { GET_FEEDS, FEEDS_LOADING } from "../actions/feedActions";

const initialState = {
  feeds: [],
  loading: false,
};

const feedReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FEEDS:
      return {
        ...state,
        feeds: action.payload,
        loading: false,
      };
    case FEEDS_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export default feedReducer;
