import { GET_ERRORS } from "../actions/authActions";
import { CLEAR_ERRORS } from "../actions/errorActions";

const initialState = {};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    case CLEAR_ERRORS:
      return initialState;
    default:
      return state;
  }
};

export default errorReducer;
