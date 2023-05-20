import {
  addProduct as addProductApi,
  fetchAllProducts,
} from "../../api/product";

export const ADD_PRODUCT = "ADD_PRODUCT";
export const GET_PRODUCTS = "GET_PRODUCTS";
export const PRODUCTS_LOADING = "PRODUCTS_LOADING";

// Add Product
export const addProduct = (productData) => (dispatch) => {
  return new Promise((resolve, reject) => {
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
