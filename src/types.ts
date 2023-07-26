export interface EndpointTypes {
  req?: unknown;
  res?: unknown;
  queries?: unknown;
}

export type Method<T extends Record<string, EndpointTypes> = {}> = T;

export interface BaseFetcherOptions {
  params?: undefined | {};
  body?: undefined | {};
  queries?: undefined | {};
  method?: string;
}

export type Fetcher<Options extends Object> = (
  url: string,
  options?: Options,
) => Promise<unknown>;

export interface Routes {
  GET: Method;
  POST: Method;
  DELETE: Record<string, EndpointTypes>;
  PUT: Record<string, EndpointTypes>;
  PATCH: Record<string, EndpointTypes>;
}
