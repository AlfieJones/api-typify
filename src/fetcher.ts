import {
  OptionalParams,
  OptionalBody,
  ExtractRes,
  HasRequiredKeys,
} from "./utils";
import { Method, BaseFetcherOptions, Fetcher, Routes } from "./types";
import { parseURL } from "./parser";

// These are optional types if you want to extend the API

export function getAPI<T extends Partial<Routes>, Options extends Object = {}>(
  base: string,
  fetcher: Fetcher<Omit<Options, "body" | "params">>,
) {
  type Defs = T & Routes;
  type ops = Omit<Options, "body" | "params">;
  return {
    get: wrapper<Defs["GET"], ops>()(fetcher, base, "GET"),
    post: wrapper<Defs["POST"], ops>()(fetcher, base, "POST"),
    delete: wrapper<Defs["DELETE"], ops>()(fetcher, base, "DELETE"),
    put: wrapper<Defs["PUT"], ops>()(fetcher, base, "PUT"),
    patch: wrapper<Defs["PATCH"], ops>()(fetcher, base, "PATCH"),
  };
}

type tsAPIOptions<
  T extends Method,
  U extends keyof T,
  FetcherOptions extends Object,
> = BaseFetcherOptions &
  OptionalParams<T, U> &
  OptionalBody<T, U> &
  FetcherOptions;

// If either body or params isn't required, then the type of the options argument should be optional
type tsAPI<
  T extends Method,
  U extends keyof T,
  O extends Object,
  R,
> = HasRequiredKeys<tsAPIOptions<T, U, O>> extends true
  ? (url: U, options: tsAPIOptions<T, U, O>) => Promise<R>
  : (url: U, options?: tsAPIOptions<T, U, O>) => Promise<R>;

const wrapper =
  <T extends Method, O extends Object>() =>
  <U extends keyof T>(fetcher: Fetcher<O>, base: string, method: string) => {
    return ((url: U, options: tsAPIOptions<T, U, O>) => {
      const fullUrl = `${base}${parseURL(
        url as string,
        options?.params as Record<string, string>,
      )}`;
      return fetcher(fullUrl, { ...options, method } as any);
    }) as tsAPI<T, U, O, ExtractRes<T[U]>>;
  };
