import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

export const authApi = createApi({
  reducerPath: 'authApi',
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/user/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    getMe: builder.query({
        query: () => '/user/me',
        providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
        query: (data) => ({
            url: '/user/profile',
            method: 'PATCH',
            body: data,
        }),
        invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
        query: (data) => ({
            url: '/auth/change-password',
            method: 'POST',
            body: data,
        }),
    }),
    getAllUsers: builder.query<any, any>({
        query: (params) => {
            const queryString = new URLSearchParams();
            if (params.page) queryString.append('page', params.page.toString());
            if (params.limit) queryString.append('limit', params.limit.toString());
            if (params.searchTerm) queryString.append('searchTerm', params.searchTerm);
            if (params.role) queryString.append('role', params.role);
            if (params.status) queryString.append('status', params.status);
            return `/user/all-users?${queryString.toString()}`;
        },
        providesTags: ['User'],
    }),
    updateUserStatus: builder.mutation<any, { id: string; status: string }>({
        query: ({ id, status }) => ({
            url: `/user/${id}/status`,
            method: 'PATCH',
            body: { status },
        }),
        invalidatesTags: ['User'],
    }),
  }),
});

export const { 
    useLoginMutation, 
    useRegisterMutation, 
    useGetMeQuery, 
    useUpdateProfileMutation, 
    useChangePasswordMutation,
    useGetAllUsersQuery,
    useUpdateUserStatusMutation
} = authApi;
