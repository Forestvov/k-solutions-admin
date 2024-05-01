export interface IUserResponse {
  content: IUser[];
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

export type UserRoleType = 'User' | 'Admin' | '';
export type AccountTypeName = 'Investor' | 'Company';

export interface IUser {
  accountId: number;
  userName: string;
  email: string;
  fio: string;
  companyName: any;
  famCeo: any;
  accountTypeName: AccountTypeName;
  numberPhone: string;
  registeredDate: string;
  balance: string;
  role: UserRoleType;
  status: string;
  files: number[];
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

export type IUserTableFilterValue = string | string[];

export interface IUserTableFilters {
  role: UserRoleType;
  email: string;
}
