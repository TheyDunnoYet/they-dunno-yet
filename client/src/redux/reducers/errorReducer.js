import { GET_ERRORS, REGISTER_FAIL } from "../actions/authActions";
import { CLEAR_ERRORS } from "../actions/errorActions";

const initialState = {
  msg: null,
};

const errorReducer = (state = initialState, action) => {
  console.log("Initial State: ", state);
  switch (action.type) {
    case GET_ERRORS:
      console.log("GET_ERRORS State: ", state);
      return {
        ...state,
        id: action.payload.id,
        msg: action.payload.msg,
      };
    case CLEAR_ERRORS:
      console.log("CLEAR_ERRORS State: ", state);
      return {
        ...state,
        id: null,
        msg: null,
      };
    case REGISTER_FAIL:
      console.log("REGISTER_FAIL State: ", state);
      return {
        ...state,
        msg: null,
        id: null,
      };
    default:
      return state;
  }
};

export default errorReducer;
