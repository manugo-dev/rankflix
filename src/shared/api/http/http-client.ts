import axios from "axios";

import type { CreateHttpClientParams, HttpClientInstance } from "./http-model";

export const createHttpClient = (config?: CreateHttpClientParams): HttpClientInstance => {
  const client = axios.create({
    ...config,
  });
  return client;
};
