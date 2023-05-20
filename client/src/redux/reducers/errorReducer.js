import { GET_ERRORS, REGISTER_FAIL } from "../actions/authActions";
import { CLEAR_ERRORS } from "../actions/errorActions";

const initialState = {
  msg: null,
};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ERRORS:
      return {
        ...state,
        id: action.payload.id,
        msg: action.payload.msg,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        id: null,
        msg: null,
      };
    case REGISTER_FAIL:
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
