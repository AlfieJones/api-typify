export interface EndpointTypes {
  req: unknown;
  res: unknown;
}

export type Method<T extends Record<string, EndpointTypes> = {}> = T;

export interface BaseFetcherOptions {
  params?: unknown;
  body?: unknown | null;
}

export type Fetcher<Options extends BaseFetcherOptions = {}> = (
  url: string,
  options?: Options,
) => Promise<unknown>;

export interface Routes {
  GET: Method;
  POST: Method;
  DELETE: Method;
  PUT: Method;
  PATCH: Method;
}
