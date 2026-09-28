export interface PaginationType{
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
  from: number | null;
  to: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationType;
  message: string;
}


