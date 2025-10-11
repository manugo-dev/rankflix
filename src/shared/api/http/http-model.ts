import type { AxiosInstance, CreateAxiosDefaults } from "axios";

export type HttpClientInstance = AxiosInstance;
export type CreateHttpClientParams = CreateAxiosDefaults | undefined;

export interface HttpClientResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface HttpClientError {
  message: string;
  code?: string;
  status?: number;
  response?: HttpClientResponse;
}

export interface HttpPaginatedRequestParams {
  page: number;
  limit?: number;
}

export interface HttpPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
