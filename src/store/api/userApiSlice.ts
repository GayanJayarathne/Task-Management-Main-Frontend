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

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: (credentials) => ({
        url: "/user",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserListQuery } = userApiSlice;
