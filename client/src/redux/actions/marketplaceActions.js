import * as api from "../../api/marketplace";

export const GET_MARKETPLACES = "GET_MARKETPLACES";
export const MARKETPLACES_LOADING = "MARKETPLACES_LOADING";

// Fetch all marketplaces
export const getMarketplaces = () => async (dispatch) => {
  dispatch(setMarketplacesLoading());
  try {
    const data = await api.fetchAllMarketplaces();
    dispatch({ type: GET_MARKETPLACES, payload: data });
  } catch (error) {
    console.error("Error:", error);
    console.error("Error Details:", error.response);
  }
};

// Create marketplace
export const createMarketplace = (marketplace) => async (dispatch) => {
  try {
    const { data } = await api.createMarketplace(marketplace);
    dispatch({ type: "CREATE_MARKETPLACE", payload: data });
  } catch (error) {
    console.error("Error:", error);
    console.error("Error Details:", error.response.data);
  }
};

// Marketplaces loading
export const setMarketplacesLoading = () => {
  return {
    type: MARKETPLACES_LOADING,
  };
};
