import useSWR from 'swr';
import { useMemo } from 'react';

import { SettingToken } from '../types/settings';
import axios, { fetcher, endpoints } from '../utils/axios';

export function useGetTokens() {
  const URL = endpoints.transaction.tokens;

  const { data, isLoading, error, isValidating, mutate } = useSWR<SettingToken[]>(
    [URL, {}, 'post'],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      tokens: data || [],
      tokensLoading: isLoading,
      tokensError: error,
      tokensValidating: isValidating,
      tokensEmpty: !isLoading && !data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export const saveTokens = async (data: any) => {
  await axios.post(endpoints.transaction.save, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
