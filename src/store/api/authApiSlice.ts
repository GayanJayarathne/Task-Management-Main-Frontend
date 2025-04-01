import { apiSlice } from "./apiSlice";
import { User } from "../../types/user";
import { BaseQueryMeta, BaseQueryResult } from "@reduxjs/toolkit/query";

interface UserResponse {
  data: {
    user: User;
    token: string;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuthenticate: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useGetAuthenticateMutation } = authApiSlice;
