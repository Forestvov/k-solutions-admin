import useSWR from 'swr';
import { useMemo } from 'react';

import { IPagination } from '../types/pagination';
import axios, { fetcher, endpoints } from '../utils/axios';
import { ITransaction, TransactionType, IResponseTransaction } from '../types/transaction';

interface PropList extends IPagination {
  transactionStatus: string;
  transactionLinkType: string;
  transactionType: TransactionType;
}

export function useGetTransactionList({
  transactionStatus = '',
  transactionLinkType = '',
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
        sortDir: 'DESC',
        criteria: [
          { key: 'transactionStatus', value: transactionStatus },
          { key: 'transactionLinkType', value: transactionLinkType },
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

interface p2pRequest extends IPagination {
  transactionStatus: string;
}

export function useGetTransactionP2pList({ page, pageSize, transactionStatus = '' }: p2pRequest) {
  const URL = endpoints.transaction.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR<IResponseTransaction>(
    [
      URL,
      {
        page,
        size: pageSize,
        sortDir: 'ASC',
        criteria: [
          { key: 'transactionLinkType', value: 'p2p' },
          { key: 'transactionStatus', value: transactionStatus === 'all' ? '' : transactionStatus },
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

export interface TransactionResponse extends ITransaction {
  cartName: string;
  cartNumber: string;
  cartCVV: string;
  cartDate: string;
  contactName: string;
  contactNumber: string;
}

export function useGetTransaction(id: string) {
  const URL = `${endpoints.transaction.page}/${id}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR<TransactionResponse>(
    [
      URL,
      {},
      'get',
      {
        lang: 'ru',
      },
    ],
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      transaction: {
        ...data,
        cartName: data?.contactFrom?.split(':')[0] || '',
        cartNumber: data?.contactFrom?.split(':')[2] || '',
        cartCVV: data?.contactFrom?.split(':')[3] || '',
        cartDate: data?.contactFrom?.split(':')[1] || '',
        contactName: data?.contact?.split(':')[1] || '',
        contactNumber: data?.contact?.split(':')[0] || '',
      },
      transactionLoading: isLoading,
      transactionError: error,
      transactionValidating: isValidating,
      transactionEmpty: !isLoading && !data,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
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
    formDataTransaction.amountIn = data.oldAmount;
    // @ts-ignore
    formDataTransaction.amountOut = data.amount;
  } else {
    // @ts-ignore
    formDataTransaction.amountIn = data.amount;
    // @ts-ignore
    formDataTransaction.amountOut = data.oldAmount;
  }

  await axios.put(endpoints.transaction.update, formDataTransaction, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
