import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.mutation({
      query: (credentials) => ({
        url: "/users",
        method: "GET",
      }),
    }),
    createUser: builder.mutation({
      query: (credentials) => ({
        url: "/users",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserById: builder.mutation({
      query: (id) => ({
        url: "/users/" + id,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: (payload) => ({
        url: "/users/" + payload._id,
        method: "PUT",
        body: payload,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: "/users/" + id,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUserListMutation,
  useCreateUserMutation,
  useGetUserByIdMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
