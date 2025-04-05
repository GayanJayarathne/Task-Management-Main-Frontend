import { apiSlice } from "./apiSlice";
import { User } from "../../types/user";

interface UserResponse {
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuthOtp: builder.mutation({
      query: (credentials) => ({
        url: "/auth/request-otp",
        method: "POST",
        body: credentials,
      }),
    }),
    authVerifyOtp: builder.mutation({
      query: (credentials) => ({
        url: "/auth/validate-otp",
        method: "POST",
        body: credentials,
      }),
    }),
    getAuthenticate: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/submit-password",
        method: "POST",
        body: credentials,
      }),
    }),
    changePassword: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/change-password",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetAuthOtpMutation,
  useAuthVerifyOtpMutation,
  useGetAuthenticateMutation,
  useChangePasswordMutation,
} = authApiSlice;
