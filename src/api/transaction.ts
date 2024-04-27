import useSWR from 'swr';
import { useMemo } from 'react';

import { IPagination } from '../types/pagination';
import axios, { fetcher, endpoints } from '../utils/axios';
import { UserRoleType, IUserResponse } from '../types/user';

interface PropList extends IPagination {
  role: UserRoleType;
  email: string;
}

export const getUserList = async ({ role = '', email = '', page, pageSize }: PropList) =>{

  const data = {role, email, page, size: pageSize}

  const res = await axios.put(endpoints.user.list, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.data
}

export function useGetUserList({ role = '', email = '', page, pageSize }: PropList) {
  const URL = endpoints.user.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR<IUserResponse>(
    [
      URL,
      {
        page,
        size: pageSize,
        sortDir: 'ASC',
        criteria: [
          { key: 'role', value: role },
          { key: 'email', value: email },
        ],
      },
      'put',
    ],
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      users: data?.content || [],
      pageInfo: {
        currentPage: data?.number || 0,
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
      },
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.content.length,
      mutate
    }),
    [
      data?.content,
      data?.last,
      data?.number,
      data?.totalElements,
      data?.totalPages,
      error,
      isLoading,
      isValidating,
    ]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

interface updateUserProp {
  accountId: number;
  status: string;
  role: string;
}

export const updateUser = async (data: { [p: string]: any; accountId: number }) => {
  const formDataCompany = {
    accountId: data.accountId,
    status: data.status,
    role: data.role,
  };

  await axios.put(endpoints.user.update, formDataCompany, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// ----------------------------------------------------------------------
