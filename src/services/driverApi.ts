import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

export const driverApi = createApi({
  reducerPath: 'driverApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://ride-booking-server.vercel.app/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['DriverProfile'],
  endpoints: (builder) => ({
    getDriverProfile: builder.query({
      query: () => '/driver/profile',
      providesTags: ['DriverProfile'],
    }),
    updateDriverProfile: builder.mutation({
      query: (data) => ({
        url: '/driver/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['DriverProfile'],
    }),
  }),
});

export const { useGetDriverProfileQuery, useUpdateDriverProfileMutation } = driverApi;
