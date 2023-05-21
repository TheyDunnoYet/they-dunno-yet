import { fetchAllTags } from "../../api/tag";

export const GET_TAGS = "GET_TAGS";
export const TAGS_LOADING = "TAGS_LOADING";

// Get Tags
export const getTags = () => (dispatch) => {
  dispatch(setTagsLoading());
  fetchAllTags()
    .then((tags) =>
      dispatch({
        type: GET_TAGS,
        payload: tags,
      })
    )
    .catch((err) => console.log("Error fetching tags: ", err));
};

// Tags loading
export const setTagsLoading = () => {
  return {
    type: TAGS_LOADING,
  };
};
