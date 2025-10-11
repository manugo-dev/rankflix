import type { HttpPaginatedRequestParams, HttpPaginatedResponse } from "./http";

export type LanguageParam = "en" | "es";

export type ParamsWithLanguage<T> = T & { language?: LanguageParam };

export type Paginated<T> = HttpPaginatedResponse<T>;

export type PaginatedParams = HttpPaginatedRequestParams;
