import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState()?.authSlice?.access_Token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({}), // Extend this later with endpoints
});
