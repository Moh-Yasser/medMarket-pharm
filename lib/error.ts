export interface BackendErrorBody {
  success: false;
  error: string;
  message: string;
  errors?: Record<string, string[]>;
}

export class PhpApiError extends Error {
  status: number;
  title: string;
  errors?: Record<string, string[]>;
  payload?: unknown;

  constructor(
    status: number,
    title: string,
    message: string,
    errors?: Record<string, string[]>,
    payload?: unknown,
  ) {
    super(message);           
    this.name = "PhpApiError";
    this.status = status;
    this.title = title;       
    this.errors = errors;     
    this.payload = payload;  
  }
}


