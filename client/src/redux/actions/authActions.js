import { loginUser, registerUser, fetchCurrentUser } from "../../api/auth";

// Action types
export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const USER_LOADING = "USER_LOADING";
export const GET_ERRORS = "GET_ERRORS";

// Login User
export const login = (userData) => (dispatch) => {
  loginUser(userData)
    .then((res) => {
      const { token } = res.data;
      // Save to localStorage
      localStorage.setItem("jwtToken", token);
      // Fetch the current user
      dispatch(getCurrentUser());
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Register User
export const register = (userData) => (dispatch) => {
  registerUser(userData)
    .then((res) => {
      const { token } = res.data;
      // Save to localStorage
      localStorage.setItem("jwtToken", token);
      // Fetch the current user
      dispatch(getCurrentUser());
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Get Current User
export const getCurrentUser = () => (dispatch) => {
  dispatch(setUserLoading());
  const token = localStorage.getItem("jwtToken");
  fetchCurrentUser(token)
    .then((res) => {
      dispatch(setCurrentUser(res.data));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Set logged in user
export const setCurrentUser = (user) => {
  return {
    type: SET_CURRENT_USER,
    payload: user,
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};
