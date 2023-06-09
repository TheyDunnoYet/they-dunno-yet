import { loginUser, registerUser, fetchCurrentUser } from "../../api/auth";

// Action types
export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const USER_LOADING = "USER_LOADING";
export const GET_ERRORS = "GET_ERRORS";
export const REGISTER_FAIL = "REGISTER_FAIL";

// Login User
export const login = (userData, stayLogged) => (dispatch) => {
  return new Promise((resolve, reject) => {
    loginUser(userData, stayLogged)
      .then((res) => {
        const { token } = res;
        if (stayLogged) {
          localStorage.setItem("jwtToken", token); // Store the token permanently in localStorage
        } else {
          sessionStorage.setItem("jwtToken", token); // Store the token temporarily in sessionStorage
        }
        // Fetch the current user
        dispatch(getCurrentUser());
        resolve(res);
      })
      .catch((err) => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
        reject(err);
      });
  });
};

// Register User
export const register = (userData) => (dispatch) => {
  registerUser(userData)
    .then((res) => {
      const { token } = res;
      localStorage.setItem("jwtToken", token);
      dispatch(getCurrentUser());
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: {
          id: "REGISTER_FAIL",
          msg: err.response.data.msg || "Something went wrong",
        },
      });
    });
};

// Get Current User
// Check both localStorage and sessionStorage for a token
export const getCurrentUser = () => (dispatch) => {
  dispatch(setUserLoading());
  const token =
    localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
  fetchCurrentUser(token)
    .then((res) => {
      dispatch(setCurrentUser(res));
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

// Log user out
export const logout = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  sessionStorage.removeItem("jwtToken"); // Remove token from session storage
  // Remove the user object from the Redux store
  dispatch(setCurrentUser({}));
};
