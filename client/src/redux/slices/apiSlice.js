import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const API_URL = import.meta.env.VITE_APP_BASE_URL + "/api";
const API_URL = "http://localhost:8800/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',  // This will send cookies with every request
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Task', 'User'],
  endpoints: (builder) => ({}),
});
