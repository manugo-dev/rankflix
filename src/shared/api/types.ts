import type { HttpPaginatedRequestParams, HttpPaginatedResponse } from "./http";

export type ParamsWithLanguage<T> = T & { language?: string };

export type Paginated<T> = HttpPaginatedResponse<T>;

export type PaginatedParams = HttpPaginatedRequestParams;
