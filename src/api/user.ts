import useSWR from 'swr';
import { useMemo } from 'react';

import { fileExtensions } from './data';
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
  status: string;
}

export function useGetVerificationUserList({
  page,
  pageSize,
  accountTypeName = '',
  email = '',
  fio = '',
  status = '',
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
          { key: 'status', operation: status ? '==' : '!=', value: status || 'Not verified YC' },
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

export const getBusinessFile = async (idFile: number, fileName: string) => {
  const URL = `${endpoints.user.businessFile}/${idFile}`;
  axios
    .get(URL, {
      responseType: 'blob',
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      // @ts-ignore
      link.setAttribute('download', `${fileName}.${fileExtensions()[response.data.type]}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.error('File download failed:', error);
    });
};

// ----------------------------------------------------------------------
