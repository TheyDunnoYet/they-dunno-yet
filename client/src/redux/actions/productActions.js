import {
  addProduct as addProductApi,
  fetchAllProducts,
  fetchAllBlockchains,
  fetchAllMarketplaces,
} from "../../api/product";

export const ADD_PRODUCT = "ADD_PRODUCT";
export const GET_PRODUCTS = "GET_PRODUCTS";
export const PRODUCTS_LOADING = "PRODUCTS_LOADING";
export const GET_BLOCKCHAINS = "GET_BLOCKCHAINS";
export const GET_MARKETPLACES = "GET_MARKETPLACES";

// Add Product
export const addProduct = (productData) => (dispatch) => {
  return new Promise((resolve, reject) => {
    // console.log("Product data: ", productData);

    // for (let [key, value] of productData.entries()) {
    //   console.log(key, value);
    // }

    addProductApi(productData)
      .then((product) => {
        dispatch({
          type: ADD_PRODUCT,
          payload: product,
        });
        resolve(product);
      })
      .catch((err) => {
        console.log("Error adding product: ", err);
        reject(err);
      });
  });
};

// Get Products
export const getProducts = () => (dispatch) => {
  dispatch(setProductsLoading());
  fetchAllProducts()
    .then((products) =>
      dispatch({
        type: GET_PRODUCTS,
        payload: products,
      })
    )
    .catch((err) => console.log("Error fetching products: ", err));
};

// Products loading
export const setProductsLoading = () => {
  return {
    type: PRODUCTS_LOADING,
  };
};

// Get Blockchains
export const getBlockchains = () => (dispatch) => {
  fetchAllBlockchains()
    .then((blockchains) =>
      dispatch({
        type: GET_BLOCKCHAINS,
        payload: blockchains,
      })
    )
    .catch((err) => console.log("Error fetching blockchains: ", err));
};

// Get Marketplaces
export const getMarketplaces = () => (dispatch) => {
  fetchAllMarketplaces()
    .then((marketplaces) =>
      dispatch({
        type: GET_MARKETPLACES,
        payload: marketplaces,
      })
    )
    .catch((err) => console.log("Error fetching marketplaces: ", err));
};
