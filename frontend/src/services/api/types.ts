export interface BackendData<T> {
  message?: string;
  data: T;
}

export interface PaginationData<T> extends Omit<BackendData<T>, "data"> {
  data: T[];
  totalPages: number;
  count: number;
  currentPage: number;
}

export type PromiseBackendData<T> = Promise<BackendData<T>>;
export type PromisePaginationData<T> = Promise<PaginationData<T>>;

export interface ResponseData<T> {
  data: T;
}

export interface DefaultRequestParams<SortByT extends string = string> {
  limit: number;
  page: number;
  sortOrder: "asc" | "desc";
  sortBy: SortByT;
  search_name?: string;
}

export type QueryParams<KeyType extends string> = {
  [key in KeyType]?: string | number | undefined;
};

export interface BaseModelProperties {
  //TODO: ZOD backend -> update then
  //This gonna be anyway as string later.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommonDeleteHookParams {
  id: string;
}
