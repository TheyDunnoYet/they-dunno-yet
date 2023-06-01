import {
  addProduct as addProductApi,
  fetchAllProducts,
  fetchAllBlockchains,
  fetchAllMarketplaces,
  uploadImage,
} from "../../api/product";

export const ADD_PRODUCT = "ADD_PRODUCT";
export const GET_PRODUCTS = "GET_PRODUCTS";
export const PRODUCTS_LOADING = "PRODUCTS_LOADING";
export const GET_BLOCKCHAINS = "GET_BLOCKCHAINS";
export const GET_MARKETPLACES = "GET_MARKETPLACES";

// Add Product
export const addProduct = (productData) => (dispatch) => {
  return new Promise((resolve, reject) => {
    // Get the image File object from the productData
    const imageFile = productData.get("image");

    const formData = new FormData();
    formData.append("image", imageFile);

    uploadImage(formData)
      .then((data) => {
        productData.set("image", data.imageUrl);

        // Now call the addProductApi function
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
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });

    // CALL UPLOAD API HERE, AND GET A URL AND THEN SEND THAT TO add Product Api.

    // Call the uploadFileToDigitalOcean function

    // uploadFileToDigitalOcean(imageFile)
    //   .then((imageUrl) => {
    //     // Replace the image File object with the returned URL in the productData
    //     productData.set('image', imageUrl)

    //     // Now call the addProductApi function
    //     addProductApi(productData)
    //       .then((product) => {
    //         dispatch({
    //           type: ADD_PRODUCT,
    //           payload: product,
    //         })
    //         resolve(product)
    //       })
    //       .catch((err) => {
    //         console.log('Error adding product: ', err)
    //         reject(err)
    //       })
    //   })
    //   .catch((err) => {
    //     console.log('Error uploading image: ', err)
    //     reject(err)
    //   })
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
