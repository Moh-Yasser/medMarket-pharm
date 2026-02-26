export interface PaginationType{
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationType;
  message: string;
}


