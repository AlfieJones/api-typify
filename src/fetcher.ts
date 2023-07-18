import {
  OptionalParams,
  OptionalBody,
  ExtractRes,
  HasRequiredKeys,
} from "./utils";
import { Method, BaseFetcherOptions, Fetcher, Routes } from "./types";
import { parseURL } from "./parser";

// These are optional types if you want to extend the API
type ExtraOptions = Record<string | number, unknown>;

export function getAPI<T extends Partial<Routes>, O extends ExtraOptions = {}>(
  base: string,
  fetcher: Fetcher<Omit<O, "body" | "params"> & BaseFetcherOptions>,
) {
  type Defs = T & Routes;
  return {
    get: wrapper<Defs["GET"], O>()(fetcher, base, "GET"),
    post: wrapper<Defs["POST"], O>()(fetcher, base, "POST"),
    delete: wrapper<Defs["DELETE"], O>()(fetcher, base, "DELETE"),
    put: wrapper<Defs["PUT"], O>()(fetcher, base, "PUT"),
    patch: wrapper<Defs["PATCH"], O>()(fetcher, base, "PATCH"),
  };
}

type tsAPIOptions<
  T extends Method,
  U extends keyof T,
  FetcherOptions extends ExtraOptions,
> = BaseFetcherOptions &
  OptionalParams<T, U> &
  OptionalBody<T, U> &
  FetcherOptions;

// If either body or params isn't required, then the type of the options argument should be optional
type tsAPI<
  T extends Method,
  U extends keyof T,
  O extends ExtraOptions,
  R,
> = HasRequiredKeys<tsAPIOptions<T, U, O>> extends true
  ? (url: U, options: tsAPIOptions<T, U, O>) => Promise<R>
  : (url: U, options?: tsAPIOptions<T, U, O>) => Promise<R>;

const wrapper =
  <T extends Method, O extends ExtraOptions>() =>
  <U extends keyof T>(fetcher: Fetcher<O>, base: string, method: string) => {
    return ((url: U, options: tsAPIOptions<T, U, O>) => {
      const fullUrl = `${base}${parseURL(
        url as string,
        options?.params as Record<string, string>,
      )}`;
      return fetcher(fullUrl, { ...options, method } as any);
    }) as tsAPI<T, U, O, ExtractRes<T[U]>>;
  };
