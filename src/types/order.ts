export interface IResponseOrder {
  content: IOrder[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export type OrderTypeStatus = 'New' | 'Responded';

export interface IOrder {
  id: number;
  phoneNumber: string;
  status: OrderTypeStatus;
  createdDate: string;
  module: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface IOrderTableFilters {
  module: string;
  status: string;
}
