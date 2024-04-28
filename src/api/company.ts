import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { IProductItem } from 'src/types/product';

import { IPagination } from '../types/pagination';
import { ExtendCompany, IDetailTypeList, ICompanyResponse } from '../types/company';
import {toBase64} from "../utils/toBase64";

// ----------------------------------------------------------------------

interface IData extends ExtendCompany {
  images: File[]
}

const addCompanyFile = async (file: string, companyInvestId: number, fileType: string) => {
  await axios.post(endpoints.company.addFile, {companyInvestId, file, fileType})
}

export const createCompany = async (data: IData) => {
  const formDataCompany = {
    companyName: data.briefcaseName,
    companyType: data.companyType,
    logo: data.logo,
    descriptions: data.descriptions,
    companyInvestDetailInputs: data.companyInvestDetailInputs,
    lang: 'ru',
  };

  const formDataBrief = {
    briefcaseName: data.briefcaseName,
    briefcaseStatus: 'In progress',
    amountFinish: data.amountFinish,
    amountMin: data.amountMin,
    ranges: data.ranges,
    percents: data.percents,
    image: data.image,
    finishDay: data.finishDay,
    pampInvestors: data.pampInvestors,
    pamAmount: data.pamAmount,
    lang: 'ru',
  };


  const resCompanyInvest = await axios.post(endpoints.company.root, formDataCompany, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { id } = resCompanyInvest.data;
  await axios.post(endpoints.briefcase.add, { ...formDataBrief, companyInvestId: id });

  if( data.images.length ) {
    const list = Promise.all(data.images.map(file => toBase64(file)))
    list.then((data) => {
      if(data.length) {
        data.map((file) => addCompanyFile(file, id, 'png'))
      }
    })
  }

};

// ----------------------------------------------------------------------

interface PropList extends IPagination {
  companytype: string;
  briefcaseStatus: string;
}

export function useGetCompanies({
  companytype = '',
  briefcaseStatus = '',
  page,
  pageSize,
}: PropList) {
  const URL = endpoints.briefcase.page;

  const { data, isLoading, error, isValidating, mutate } = useSWR<ICompanyResponse>(
    [
      URL,
      {
        page,
        size: pageSize,
        sortDir: 'ASC',
        criteria: [
          { key: 'companytype', value: companytype },
          { key: 'briefcaseStatus', value: briefcaseStatus },
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
      companies: data?.content?.map((item) => ({ ...item, id: item.briefcaseId })) || [],
      pageInfo: {
        total: data?.totalElements || 0,
        hasNextPage: !data?.last || false,
      },
      companiesLoading: isLoading,
      companiesError: error,
      companiesValidating: isValidating,
      companiesEmpty: !isLoading && !data?.content.length,
      mutate,
    }),
    [data?.content, data?.last, data?.totalElements, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCompaniesDetailList() {
  const URL = endpoints.company.detailList;

  const { data, isLoading, error, isValidating } = useSWR<IDetailTypeList[]>(
    [URL, {}, 'post'],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      detailList: data || [],
      detailLoading: isLoading,
      detailError: error,
      detailValidating: isValidating,
      detailEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId: string) {
  const URL = productId ? [endpoints.product.details, { params: { productId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product as IProductItem,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query: string) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IProductItem[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
