import { apiSlice } from "./apiSlice";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTaskList: builder.mutation({
      query: () => ({
        url: "/tasks",
        method: "GET",
      }),
    }),
    createTask: builder.mutation({
      query: (credentials) => ({
        url: "/tasks",
        method: "POST",
        body: credentials,
      }),
    }),
    getTaskById: builder.mutation({
      query: (id) => ({
        url: "/tasks/" + id,
        method: "GET",
      }),
    }),
    updateTask: builder.mutation({
      query: (payload) => ({
        url: "/tasks/" + payload._id,
        method: "PUT",
        body: payload,
      }),
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: "/tasks/" + id,
        method: "DELETE",
      }),
    }),
    getTaskByUserId: builder.mutation({
      query: (userId) => ({
        url: "/tasks/user/" + userId,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetTaskListMutation,
  useCreateTaskMutation,
  useGetTaskByIdMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskByUserIdMutation,
} = taskApiSlice;
