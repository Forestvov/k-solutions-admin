// ----------------------------------------------------------------------

import useSWR from 'swr';
import { useMemo } from 'react';

import { BriefResponse } from '../types/brief';
import { IPagination } from '../types/pagination';
import axios, { fetcher, endpoints } from '../utils/axios';

interface PropList extends IPagination {
  briefcaseAccountStatus: string;
  email: string;
}

export function useGetCloseBrief({
  briefcaseAccountStatus = 'Order to close',
  email = '',
  page,
  pageSize,
}: PropList) {
  const URL = endpoints.briefcase.adminPage;

  const { data, isLoading, error, isValidating, mutate } = useSWR<BriefResponse>(
    [
      URL,
      {
        page,
        size: pageSize,
        sortDir: 'DESC',
        sortField: 'createddate',
        criteria: [
          { key: 'briefcaseAccountStatus', value: briefcaseAccountStatus },
          { key: 'email', value: email },
          { key: 'type', value: 'Return' },
        ],
      },
      'post',
    ],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      list: data?.content || [],
      pageInfo: {
        currentPage: data?.number || 0,
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
      },
      listLoading: isLoading,
      listError: error,
      listValidating: isValidating,
      listEmpty: !isLoading && !data?.content.length,
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

export const updateBrief = async (id: number, status: string) => {
  await axios.put(`${endpoints.briefcase.updateBrief}/${id}/${status}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
