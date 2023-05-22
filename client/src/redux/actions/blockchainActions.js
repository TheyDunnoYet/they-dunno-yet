import { fetchAllBlockchains } from "../../api/blockchain";

export const GET_BLOCKCHAINS = "GET_BLOCKCHAINS";
export const BLOCKCHAINS_LOADING = "BLOCKCHAINS_LOADING";

// Get Blockchains
export const getBlockchains = () => (dispatch) => {
  dispatch(setBlockchainsLoading());
  fetchAllBlockchains()
    .then((blockchains) =>
      dispatch({
        type: GET_BLOCKCHAINS,
        payload: blockchains,
      })
    )
    .catch((err) => console.log("Error fetching blockchains: ", err));
};

// Blockchains loading
export const setBlockchainsLoading = () => {
  return {
    type: BLOCKCHAINS_LOADING,
  };
};
