import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Turtle } from "lucide-react";

const initialState = {
  loading: false,
  user: {},
  isAuthenticated: false,
  error: null,
  message: null,
  isUpdated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SignupRequested(state) {},
    SignupSucess(state) {},
    SignupFailed(state) {},

    loginRequested(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = action.payload;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = state.isAuthenticated;
      state.user = state.user;
      state.error = action.payload;
    },
    updatePasswordRequest(state) {
      state.loading = true;
      state.isUpdated = false;
      state.message = null;
      state.error = null;
    },
    updatePasswordSucess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      state.message = action.payload;
      state.error = null;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.message = null;
      state.error = action.payload;
    },
    GetMyProfileLoading(state, action) {
      (state.loading = true), (state.isUpdated = false);
      state.message = false;
      state.error = null;
    },
    GetMyProfileSucess(state, action) {
      (state.loading = true), (state.isUpdated = true);
      state.message = action.payload;
      state.error = null;
    },
    GetMyProfileFailed(state, action) {
      (state.loading = false), (state.isUpdated = false);
      state.message = false;
      state.error = action.payload;
    },

    clearAllError(state) {
      state.error = null;
    },
  },
});

export const {
  loginRequested,
  loginSuccess,
  loginFailed,
  logoutSuccess,
  logoutFailed,
  updatePasswordRequest,
  updatePasswordSucess,
  updatePasswordFailed,
  clearAllError, // Explicitly exporting the clearAllError action
} = userSlice.actions;
export const register = (email, password) => async (dispatch) => {};
export const login = (email, password) => async (dispatch) => {
  dispatch(loginRequested());
  try {
    const { data } = await axios.post(
      "http://localhost:3004/api/v1/user/login",
      { email, password },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(loginSuccess(data.user));
    dispatch(clearAllError());
  } catch (error) {
    dispatch(loginFailed(error.response?.data?.message || "Login failed"));
  }
};
export const GetMyProfile = () => async (dispatch) => {
  dispatch(GetMyProfileLoading());
  try {
    const { data } = await axios.get(
      "http://localhost:3004/api/v1/user/myprofile",
      {
        withCredentials: true,
      }
    );
    dispatch(loginSuccess(data.user));
    dispatch(clearAllError());
  } catch (err) {
    dispatch(loginFailed(err.response?.data?.message || "Login failed"));
  }
};
export const logout = () => async (dispatch) => {
  try {
    const { data } = await axios.post(
      "http://localhost:3004/api/v1/user/logout",

      {
        withCredentials: true,
      }
    );

    dispatch(logoutSuccess(data.message));
    dispatch(clearAllError());
  } catch (error) {
    dispatch(logoutFailed(error.response?.data?.message || "Failed to logout"));
  }
};

export const updatePassword =
  (currentpassword, newpassword, confirmationpassword) => async (dispatch) => {
    dispatch(updatePasswordRequest());
    try {
      const { data } = await axios.put(
        "http://localhost:3004/api/v1/user/update/password",
        { currentpassword, newpassword, confirmationpassword },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      dispatch(updatePasswordSucess(data.message));
      dispatch(clearAllError());
    } catch (error) {
      dispatch(
        updatePasswordFailed(error.response?.data?.message || "Update failed")
      );
    }
  };

export const clearAllUserError = () => (dispatch) => {
  dispatch(clearAllError());
};

export default userSlice.reducer;
