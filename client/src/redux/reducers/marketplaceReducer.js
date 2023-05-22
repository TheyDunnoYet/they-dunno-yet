import {
  GET_MARKETPLACES,
  MARKETPLACES_LOADING,
} from "../actions/marketplaceActions";

const initialState = {
  marketplaces: [],
  loading: false,
};

const marketplaceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MARKETPLACES:
      return {
        ...state,
        marketplaces: action.payload,
        loading: false,
      };
    case MARKETPLACES_LOADING:
      return {
        ...state,
        loading: true,
      };
    case "CREATE_MARKETPLACE":
      return {
        ...state,
        marketplaces: [...state.marketplaces, action.payload],
      };
    default:
      return state;
  }
};

export default marketplaceReducer;
