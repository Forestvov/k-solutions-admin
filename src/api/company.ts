import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { IProductItem } from 'src/types/product';

import { toBase64 } from '../utils/toBase64';
import { IPagination } from '../types/pagination';
import { ExtendCompany, IDetailTypeList, ICompanyResponse } from '../types/company';

// ----------------------------------------------------------------------

// @ts-ignore
interface IData extends ExtendCompany {
  images: File[];
}

const addCompanyFile = async (file: string, companyInvestId: number, fileType: string) => {
  await axios.post(endpoints.company.addFile, { companyInvestId, file, fileType });
};

export const addEditCompanyFile = async (file: File, companyInvestId: number) => {
  const fileFormat = await toBase64(file);
  await addCompanyFile(fileFormat, companyInvestId, 'png');
};

export const deleteCompanyFile = async (dataId: string) => {
  await axios.delete(`${endpoints.company.deleteFile}/${dataId}`);
};

export const createCompany = async (data: IData) => {
  const formDataCompany = {
    companyName: data.briefcaseName,
    companyType: data.companyType,
    logo: data.logo,
    briefcaseStatus: data.briefcaseStatus,
    descriptions: data.descriptions,
    companyInvestDetailInputs: data.companyInvestDetailInputs,
    lang: 'ru',
  };

  const formDataBrief = {
    briefcaseName: data.briefcaseName,
    briefcaseStatus: data.briefcaseStatus,
    amountFinish: data.amountFinish,
    amountMin: data.amountMin,
    ranges: data.ranges,
    percents: data.percents,
    image: data.image,
    finishDay: data.finishDay,
    pampInvestors: data.pampInvestors,
    pampAmount: data.pampAmount,
    lang: 'ru',
  };

  const resCompanyInvest = await axios.post(endpoints.company.root, formDataCompany, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { id } = resCompanyInvest.data;

  const resBrief = await axios.post(endpoints.briefcase.add, {
    ...formDataBrief,
    companyInvestId: id,
  });
  const { briefcaseId } = resBrief.data;

  if (data.images.length) {
    const list = Promise.all(data.images.map((file) => toBase64(file)));
    // eslint-disable-next-line @typescript-eslint/no-shadow
    list.then((data) => {
      if (data.length) {
        data.map((file) => addCompanyFile(file, id, 'png'));
      }
    });
  }

  return {
    companyInvestId: id,
    briefcaseId,
  };
};

// ----------------------------------------------------------------------

export const updateCompany = async (data: IData, briefcaseId: number, companyId: number) => {
  const formDataCompany = {
    id: companyId,
    companyName: data.briefcaseName,
    companyType: data.companyType,
    logo: data.logo,
    descriptions: data.descriptions,
    companyInvestDetailInputs: data.companyInvestDetailInputs,
    lang: data.lang,
  };

  const formDataBrief = {
    briefcaseId,
    briefcaseName: data.briefcaseName,
    briefcaseStatus: data.briefcaseStatus,
    amountFinish: data.amountFinish,
    amountMin: data.amountMin,
    ranges: data.ranges,
    percents: data.percents,
    image: data.image,
    finishDay: data.finishDay,
    pampInvestors: data.pampInvestors,
    pampAmount: data.pampAmount,
    lang: data.lang,
  };

  await axios.put(endpoints.company.root, formDataCompany, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  await axios.put(endpoints.briefcase.updateBriefLang, { ...formDataBrief });
};

// ----------------------------------------------------------------------

interface PropList extends IPagination {
  companyType: string;
  briefcaseStatus: string;
}

export function useGetCompanies({
  companyType = '',
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
        sortDir: 'DESC',
        sortField: 'createdDate',
        criteria: [
          { key: 'companyType', value: companyType },
          { key: 'briefcaseStatus', value: briefcaseStatus },
        ],
      },
      'post',
      {
        lang: 'ru',
      },
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
    [
      URL,
      {
        criteria: [{ key: 'lang', value: 'ru' }],
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

export function useGetBrief(id: string, lang: string) {
  const URL = `${endpoints.briefcase.details}/${id}`;

  const { data, isLoading, error, isValidating } = useSWR<ExtendCompany>(
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
      brief: data,
      briefLoading: isLoading,
      briefError: error,
      briefValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCompany(id: string, lang: string) {
  const URL = `${endpoints.company.root}/${id}`;

  const { data, isLoading, error, isValidating } = useSWR<ExtendCompany>(
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
      company: data,
      companyLoading: isLoading,
      companyError: error,
      companyValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

export function useGetFiles(id: string) {
  const URL = `${endpoints.company.files}/${id}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR<File[]>(
    [
      URL,
      {},
      'get',
      {
        lang: 'ru',
      },
    ],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      files: data?.map((dataFile) =>
        Object.assign(dataFile, {
          // @ts-ignore
          preview: dataFile.file,
        })
      ),
      filesLoading: isLoading,
      filesError: error,
      filesValidating: isValidating,
      mutate
    }),
    [data, error, isLoading, isValidating, mutate]
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
