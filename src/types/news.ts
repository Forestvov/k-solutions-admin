export interface IResponseNews {
  content: INewPost[];
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

export interface INewPost {
  id: number;
  newsTypeId: string;
  newsType: string;
  title: string;
  descriptions: string;
  createdDate: string;
  lang: string;
  photo: string;
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

export type LangType = 'ru' | 'eng' | 'de';

export interface NewsFilter {
  lang: LangType;
}
