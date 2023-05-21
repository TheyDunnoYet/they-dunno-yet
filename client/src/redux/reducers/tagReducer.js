import { GET_TAGS, TAGS_LOADING } from "../actions/tagActions";

const initialState = {
  tags: [],
  loading: false,
};

const tagReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TAGS:
      return {
        ...state,
        tags: action.payload,
        loading: false,
      };
    case TAGS_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export default tagReducer;
