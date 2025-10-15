import type { AxiosInstance, CreateAxiosDefaults } from "axios";

export type HttpClientInstance = AxiosInstance;
export type CreateHttpClientParams = CreateAxiosDefaults | undefined;

export interface HttpClientResponse<T = unknown> {
  data: T;
  headers: Record<string, string>;
  status: number;
  statusText: string;
}

export interface HttpClientError {
  code?: string;
  message: string;
  response?: HttpClientResponse;
  status?: number;
}

export interface HttpPaginatedRequestParams {
  limit?: number;
  page: number;
}

export interface HttpPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
