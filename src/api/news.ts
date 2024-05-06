import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { IPagination } from '../types/pagination';
import { INewPost, LangType, IResponseNews } from '../types/news';

// ----------------------------------------------------------------------

interface PropList extends IPagination {
  lang: LangType;
}

export function useGetNews({ lang = 'ru', page, pageSize }: PropList) {
  const URL = endpoints.news.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR<IResponseNews>(
    [
      URL,
      {
        page,
        size: pageSize,
        sortDir: 'DESC',
        sortField: 'createdDate',
        criteria: [{ key: 'lang', value: lang }],
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
      news: data?.content || [],
      pageInfo: {
        total: data?.totalElements || 0,
        hasNextPage: !data?.last || false,
      },
      newsLoading: isLoading,
      newsError: error,
      newsValidating: isValidating,
      newsEmpty: !isLoading && !data?.content.length,
      mutate,
    }),
    [data?.content, data?.last, data?.totalElements, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export const createNews = async (data: any) => {
  await axios.post(endpoints.news.page, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// ----------------------------------------------------------------------

export const updateNews = async (data: any) => {
  await axios.put(endpoints.news.page, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// ----------------------------------------------------------------------

export const deleteNews = async (id: number) => {
  await axios.delete(`${endpoints.news.page}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export function useGetNew(id: string, lang = 'ru') {
  const URL = `${endpoints.news.page}/${id}`;

  const { data, isLoading, error, isValidating } = useSWR<INewPost>(
    [
      URL,
      {},
      'get',
      {
        lang,
      },
    ],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      newData: data,
      newDataLoading: isLoading,
      newDataError: error,
      newDataValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
