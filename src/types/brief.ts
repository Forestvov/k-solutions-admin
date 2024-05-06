export interface BriefResponse {
  content: IBrief[];
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

export interface IBrief {
  briefcaseAccountDetailId: number;
  currentAmount: number;
  briefcaseAccountId: number;
  briefcaseId: number;
  accountId: number;
  accountFio: string;
  accountUsername: string;
  email: string;
  briefcaseName: string;
  briefcaseCode: any;
  amount: number;
  createddate: string;
  briefcaseAccountStatus: string;
  briefcaseAccountOrderToCloseStatus: string;
}

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

export type ICloseTableFilterValue = string;
export interface ICloseTableFilters {
  briefcaseAccountStatus: string;
  email: string;
}
