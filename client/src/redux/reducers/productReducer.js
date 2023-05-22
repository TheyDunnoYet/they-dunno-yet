import {
  GET_PRODUCTS,
  PRODUCTS_LOADING,
  ADD_PRODUCT,
  GET_BLOCKCHAINS,
  GET_MARKETPLACES,
} from "../actions/productActions";

const initialState = {
  products: [],
  blockchains: [],
  marketplaces: {},
  loading: false,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case PRODUCTS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case GET_BLOCKCHAINS:
      return {
        ...state,
        blockchains: action.payload,
      };
    case GET_MARKETPLACES:
      return {
        ...state,
        marketplaces: action.payload,
      };
    default:
      return state;
  }
};

export default productReducer;
