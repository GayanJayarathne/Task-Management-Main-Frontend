import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.mutation({
      query: () => ({
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
    getUserDropdown: builder.mutation({
      query: () => ({
        url: "/users/dropdown",
        method: "GET",
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
  useGetUserDropdownMutation,
} = userApiSlice;
