import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store"; 
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token =
    (getState() as RootState).auth.accessToken || localStorage.getItem("accessToken");
    console.log("Токен в хранилище",token)

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 });

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithRetry,
  refetchOnMountOrArgChange: true,
  tagTypes: ['User', 'Profile'],
  endpoints: () => ({}),
});
