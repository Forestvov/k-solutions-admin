import useSWR from 'swr';
import { useMemo } from 'react';

import { IResponseOrder } from '../types/order';
import { IPagination } from '../types/pagination';
import axios, { fetcher, endpoints } from '../utils/axios';

interface Request extends IPagination {
  module: string;
  status: string;
}

export function useGetOrder({ module, status, page, pageSize }: Request) {
  const URL = endpoints.order.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR<IResponseOrder>(
    [
      URL,
      {
        page,
        size: pageSize,
        sortDir: 'DESC',
        sortField: 'id',
        criteria: [
          { key: 'module', value: module },
          { key: 'status', value: status }
        ],
      },
      'post',
      {},
    ],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      orderData: data?.content || [],
      pageInfo: {
        currentPage: data?.number || 0,
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
      },
      mutate,
      orderDataLoading: isLoading,
      orderDataError: error,
      orderDataValidating: isValidating,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export const updateOrder = async (id: number) => {
  await axios.put(`${endpoints.order.update}/${id}`, '', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// ----------------------------------------------------------------------
