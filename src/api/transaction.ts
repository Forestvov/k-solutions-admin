import useSWR from 'swr';
import { useMemo } from 'react';

import { IPagination } from '../types/pagination';
import axios, { fetcher, endpoints } from '../utils/axios';
import { TransactionType, IResponseTransaction } from '../types/transaction';

interface PropList extends IPagination {
  transactionStatus: string;
  typePay: string;
  transactionType: TransactionType;
}

export function useGetTransactionList({
  transactionStatus = '',
  typePay = '',
  transactionType,
  page,
  pageSize,
}: PropList) {
  const URL = endpoints.transaction.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR<IResponseTransaction>(
    [
      URL,
      {
        page,
        size: pageSize,
        sortDir: 'ASC',
        criteria: [
          { key: 'transactionStatus', value: transactionStatus },
          { key: 'typePay', value: typePay },
          { key: 'transactionType', value: transactionType },
        ],
      },
      'post',
    ],
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      transactions: data?.content || [],
      pageInfo: {
        currentPage: data?.number || 0,
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
      },
      transactionsLoading: isLoading,
      transactionsError: error,
      transactionsValidating: isValidating,
      transactionsEmpty: !isLoading && !data?.content.length,
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

// ----------------------------------------------------------------------

export const updateTransaction = async (data: { [p: string]: any }) => {
  const formDataTransaction = {
    transactionId: data.transactionId,
    transactionType: data.transactionType,
    transactionStatus: data.transactionStatus,
  };

  if (data.transactionType === 'In') {
    // @ts-ignore
    formDataTransaction.amountIn = data.amount;
  } else {
    // @ts-ignore
    formDataTransaction.amountOut = data.amount;
  }

  await axios.put(endpoints.transaction.update, formDataTransaction, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// ----------------------------------------------------------------------
// {
//     "transactionId":"2",
//     "amountIn":"10",
//     "amountOut":"1000",
//     "transactionType":"In",
//     "transactionStatus":"Success"
// }
