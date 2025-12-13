export interface PaginatedOutput<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    page: number;
    size: number;
  };
}