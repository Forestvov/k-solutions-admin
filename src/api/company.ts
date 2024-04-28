import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { IProductItem } from 'src/types/product';

import { IPagination } from '../types/pagination';
import { ExtendCompany, IDetailTypeList, ICompanyResponse } from '../types/company';
import { TransactionType } from '../types/transaction';

// ----------------------------------------------------------------------

export const createCompany = async (data: ExtendCompany) => {
  const formData = new FormData();

  // const formDataCompany = {
  //   companyName: data.companyName,
  //   companyType: data.companyType,
  //   logo: data.logo,
  //   descriptions: data.descriptions,
  //   companyInvestDetailInputs: data.companyInvestDetailInputs,
  // };

  if (data.companyType === 'Company') {
    formData.append('amountFinish', data.amountFinish.toString());
    formData.append('finishDay', data.finishDay.toString());
    formData.append('ranges', data.ranges.toString());
  }

  // const resCompanyInvest = await axios.post(endpoints.company.root, formDataCompany, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });

  // const { id } = resCompanyInvest.data;

  // for (var pair of formData.entries()) {
  //     console.log(pair[0]+ '  ----  ' + pair[1]);
  // }

  // const res = await axios.post(endpoints.auth.login, data);
  // const { acceptToken } = res.data;
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

  const { data, isLoading, error, isValidating } = useSWR<IDetailTypeList[]>([URL], fetcher, {
    revalidateOnFocus: false,
  });

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
