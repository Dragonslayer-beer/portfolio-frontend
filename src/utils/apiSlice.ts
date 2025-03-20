//src/utils/apiSlice.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const apiSlice = createApi({
  baseQuery:
    fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_BASE_API,
      prepareHeaders: async (headers
      ) => {
        const sessionData: any = await getSession();
        const session = sessionData as any | undefined;
        headers.set("Authorization", `Bearer ${session?.accessToken ?? ''}`);
        return headers;
      },
      responseHandler: async (response: any) => {
        if (response.status === 401) {
          return;
        } else if (response.status === 403) {
          return;
        }
        else if (response.status >= 500) {
          return;
        }

        return response.json();
      },
    }),
  endpoints: (_builder) => ({}),
  //tagTypes: [],
});
