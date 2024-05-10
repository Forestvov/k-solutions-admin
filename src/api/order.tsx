import useSWR from 'swr';
import { useMemo } from 'react';

import { IResponseOrder } from '../types/order';
import { IPagination } from '../types/pagination';
import { fetcher, endpoints } from '../utils/axios';

interface Request extends IPagination {
  module: string;
}

export function useGetOrder({ module, page, pageSize }: Request) {
  const URL = endpoints.order.list;

  const { data, isLoading, error, isValidating } = useSWR<IResponseOrder>(
    [
      URL,
      {
        page,
        size: pageSize,
        sortDir: 'DESC',
        sortField: 'id',
        criteria: [{ key: 'module', value: module }],
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
      orderDataLoading: isLoading,
      orderDataError: error,
      orderDataValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
