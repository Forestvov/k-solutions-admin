import { AccountTypeName } from './user';

export interface IResponseTransaction {
  content: ITransaction[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort2;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ITransaction {
  transactionId: number;
  accountId: number;
  transactionType: string;
  transactionStatus: string;
  transactionLinkType: string;
  transactionDate: string;
  accountTypeName: AccountTypeName;
  email: string;
  currentName: any;
  typePay: string;
  amount: number;
  amountOut: number;
  fio: string;
  username: string;
  image: string;
  contactFrom: string;
  contact: string;
  qrCode: string;
  amountIn: number;
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

export type TransactionType = 'In' | 'Out' | '';
export type ITransactionTableFilterValue = string | string[];

export interface ITransactionTableFilters {
  transactionStatus: string;
  transactionLinkType: string;
  transactionType: TransactionType;
  email: '';
}

export interface CounterResponse {
  waitRequisitesCount: number;
  processCount: number;
  supportCount: number;
  markAsPaidCount: number;
  cancelledCount: number;
  successCount: number;
  hiddenCount: number;
}

export interface IP2PTableFilters {
  transactionStatus: string;
  transactionType: 'In' | 'Out';
}
