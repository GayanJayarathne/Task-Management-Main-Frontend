import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import { getArrayFromLocalStorage } from "../../utils/helpers";

export interface AuthState {
  user?: User | null;
  token?: string | null;
  refreshToken?: string | null;
}

const getToken = () => {
  return localStorage.getItem("token") ? localStorage.getItem("token") : null;
};

const getRefreshToken = () => {
  return localStorage.getItem("token")
    ? localStorage.getItem("refreshToken")
    : null;
};

const getUser = () => {
  return getArrayFromLocalStorage("user");
};

const initialState: AuthState = {
  token: getToken(),
  user: getUser(),
  refreshToken: getRefreshToken(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { setUser, setToken, setRefreshToken, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectUser = (state: any) => state.auth.user;
export const selectToken = (state: any) => state.auth.token;
