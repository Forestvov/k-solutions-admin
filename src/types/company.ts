export interface ICompanyResponse {
  content: ICompany[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort2;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export type CompanyType = 'Company' | 'Franchise' | '';
export type StatusType = 'In progress' | 'Collection completed' | 'Loan payed' | '';

export interface ICompany {
  id: number;
  briefcaseId: number;
  briefcaseName: string;
  briefcaseStatus: StatusType;
  amountFinish: string | number;
  amountMin: number;
  ranges: number;
  percents: number;
  image: string;
  companyInvestId: number;
  finishDay: string;
  createdDate: string;
  pampInvestors: number;
  pampAmount: number;
  companyType: CompanyType;
}

export interface ICompanyExtend {
  companyName: string;
  companyType: CompanyType;
  logo: string;
  descriptions: string;
  companyInvestDetailDtoList: any;
  companyInvestDetailInputs: {
    id: string;
    companyInvestDetailTypeId: string;
    companyInvestDetailTypeDescriptions: string;
    descriptions: string;
  }[];
}

export interface ExtendCompany extends ICompany, ICompanyExtend {}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Sort2 {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface IDetailTypeList {
  id: number;
  descriptions: string;
}

export type ICompanyTableFilters = {
  companyType: CompanyType;
  briefcaseStatus: StatusType;
};
