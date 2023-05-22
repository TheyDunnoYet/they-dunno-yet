import {
  GET_BLOCKCHAINS,
  BLOCKCHAINS_LOADING,
} from "../actions/blockchainActions";

const initialState = {
  blockchains: [],
  loading: false,
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BLOCKCHAINS:
      return {
        ...state,
        blockchains: action.payload,
        loading: false,
      };
    case BLOCKCHAINS_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export default blockchainReducer;
