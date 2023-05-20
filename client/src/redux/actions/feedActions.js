import { fetchAllFeeds } from "../../api/feed";

export const GET_FEEDS = "GET_FEEDS";
export const FEEDS_LOADING = "FEEDS_LOADING";

// Get Feeds
export const getFeeds = () => (dispatch) => {
  dispatch(setFeedsLoading());
  fetchAllFeeds()
    .then((feeds) =>
      dispatch({
        type: GET_FEEDS,
        payload: feeds,
      })
    )
    .catch((err) => console.log("Error fetching feeds: ", err));
};

// Feeds loading
export const setFeedsLoading = () => {
  return {
    type: FEEDS_LOADING,
  };
};
