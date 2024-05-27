import useSWR from 'swr';
import { useMemo } from 'react';

import { IPagination } from '../types/pagination';
import axios, { fetcher, endpoints } from '../utils/axios';
import { UserRoleType, IUserResponse } from '../types/user';

interface PropList extends IPagination {
  role: UserRoleType;
  email: string;
  status: string;
  fio: string;
  accountTypeName: string;
}

export function useGetUserList({
  role = '',
  email = '',
  fio = '',
  accountTypeName = '',
  page,
  pageSize,
  status,
}: PropList) {
  const URL = endpoints.user.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR<IUserResponse>(
    [
      URL,
      {
        page,
        size: pageSize,
        sortDir: 'DESC',
        sortField: 'registeredDate',
        criteria: [
          { key: 'role', value: role },
          { key: 'email', value: email },
          { key: 'status', value: status },
          { key: 'fio', value: fio },
          { key: 'accountTypeName', value: accountTypeName },
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
      mutate,
    }),
    [
      data?.content,
      data?.number,
      data?.totalElements,
      data?.totalPages,
      error,
      isLoading,
      isValidating,
      mutate,
    ]
  );

  return memoizedValue;
}

// --------------------------------------

interface VerificationPropList extends IPagination {
  accountTypeName: string;
  email: string;
  fio: string;
}

export function useGetVerificationUserList({
  page,
  pageSize,
  accountTypeName = '',
  email = '',
  fio = '',
}: VerificationPropList) {
  const URL = endpoints.user.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR<IUserResponse>(
    [
      URL,
      {
        page,
        size: pageSize,
        sortDir: 'DESC',
        sortField: 'registeredDate',
        criteria: [
          { key: 'email', value: email },
          { key: 'fio', value: fio },
          { key: 'accountTypeName', value: accountTypeName },
          { key: 'status', value: 'Process' },
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
      mutate,
    }),
    [
      data?.content,
      data?.number,
      data?.totalElements,
      data?.totalPages,
      error,
      isLoading,
      isValidating,
      mutate,
    ]
  );

  return memoizedValue;
}

export const updateUser = async (data: { [p: string]: any; accountId: number }) => {
  const formDataCompany = {
    accountId: data.accountId,
    status: data.status,
    role: data.role || 'User',
  };

  await axios.put(endpoints.user.update, formDataCompany, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// ----------------------------------------------------------------------
