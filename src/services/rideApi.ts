import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

export const rideApi = createApi({
  reducerPath: 'rideApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Rides', 'AvailableRides', 'RideStatus', 'Dashboard'],
  endpoints: (builder) => ({
    requestRide: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ride/request',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Rides'],
    }),
    estimateFare: builder.mutation<any, { pickup: string; destination: string }>({
        query: (body) => ({
            url: '/ride/estimate-fare',
            method: 'POST',
            body,
        }),
    }),
    getRideHistory: builder.query<any, { page?: number; limit?: number; status?: string; date?: string, riderName?: string, driverName?: string } | void>({
      query: (params) => {
          if (!params) return '/ride/history';
          const queryString = new URLSearchParams();
          if (params.page) queryString.append('page', params.page.toString());
          if (params.limit) queryString.append('limit', params.limit.toString());
          if (params.status && params.status !== 'all') queryString.append('status', params.status);
          if (params.date) queryString.append('date', params.date);
          if (params.riderName) queryString.append('riderName', params.riderName);
          if (params.driverName) queryString.append('driverName', params.driverName);
          return `/ride/history?${queryString.toString()}`;
      },
      providesTags: ['Rides'],
    }),
    getAvailableRides: builder.query<any, void>({
        query: () => '/ride/available',
        providesTags: ['AvailableRides'],
    }),
    getSingleRide: builder.query<any, string>({
        query: (id) => `/ride/${id}`,
        providesTags: ['RideStatus'],
    }),
    acceptRide: builder.mutation<any, string>({
        query: (id) => ({
            url: `/ride/${id}/accept`,
            method: 'PATCH',
        }),
        invalidatesTags: ['AvailableRides', 'RideStatus', 'Rides', 'Dashboard'],
    }),
    updateRideStatus: builder.mutation<any, { id: string; status: string }>({
        query: ({ id, status }) => ({
            url: `/ride/${id}/status`,
            method: 'PATCH',
            body: { status },
        }),
        invalidatesTags: ['RideStatus', 'Rides', 'Dashboard'],
    }),
    cancelRide: builder.mutation<any, { id: string; reason?: string }>({
        query: ({ id, reason }) => ({
            url: `/ride/${id}/cancel`,
            method: 'PATCH',
            body: { cancellationReason: reason },
        }),
        invalidatesTags: ['Rides', 'RideStatus', 'AvailableRides', 'Dashboard'],
    }),
    getDriverEarnings: builder.query<any, string | void>({
        query: (period) => period ? `/driver/earnings?period=${period}` : '/driver/earnings',
        providesTags: ['Dashboard'],
    }),
    getDriverDashboard: builder.query<any, void>({
        query: () => '/driver/dashboard',
        providesTags: ['Dashboard'],
    }),
    updateDriverStatus: builder.mutation<any, { status: string; location?: any }>({
        query: (body) => ({
            url: '/driver/status',
            method: 'PATCH',
            body,
        }),
        invalidatesTags: ['Dashboard'],
    }),
    getAdminAnalytics: builder.query<any, void>({
        query: () => '/ride/admin/analytics',
        providesTags: ['Dashboard'],
    }),
  }),
});

export const { 
    useRequestRideMutation, 
    useGetRideHistoryQuery,
    useGetAvailableRidesQuery,
    useGetSingleRideQuery,
    useAcceptRideMutation,
    useUpdateRideStatusMutation,
    useCancelRideMutation,
    useGetDriverEarningsQuery,
    useGetDriverDashboardQuery,
    useUpdateDriverStatusMutation,
    useEstimateFareMutation,
    useGetAdminAnalyticsQuery
} = rideApi;
