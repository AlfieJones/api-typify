import { ReservedKeys, tsAPIOptions, Extract } from "./utils";
import { Fetcher, Routes, BaseFetcherOptions, EndpointTypes } from "./types";
import { parseURL } from "./parser";

// These are optional types if you want to extend the API

export function getAPI<T extends Partial<Routes>, Options extends Object = {}>(
  base: string,
  fetcher: Fetcher<Omit<Options, ReservedKeys>>,
) {
  type Defs = T & Routes;
  type ops = Omit<Options, ReservedKeys>;
  return {
    get: wrapper<Defs["GET"], ops>()(fetcher, base, "GET"),
    post: wrapper<Defs["POST"], ops>()(fetcher, base, "POST"),
    delete: wrapper<Defs["DELETE"], ops>()(fetcher, base, "DELETE"),
    put: wrapper<Defs["PUT"], ops>()(fetcher, base, "PUT"),
    patch: wrapper<Defs["PATCH"], ops>()(fetcher, base, "PATCH"),
  };
}

const wrapper =
  <T extends Record<string, EndpointTypes>, O extends Object>() =>
  (fetcher: Fetcher<O & BaseFetcherOptions>, base: string, method: string) =>
  <U extends keyof T & string>(url: U, options?: tsAPIOptions<T, U, O>) => {
    const searchParams = new URLSearchParams(options?.queries || {});
    return fetcher(
      `${base}${parseURL(
        url,
        options?.params as Record<string, string>,
      )}?${searchParams.toString()}`,
      {
        ...(options ? options : {}),
        body: JSON.stringify(options?.body) || undefined,
        method,
      } as O & BaseFetcherOptions,
    ) as Promise<Extract<T[U], "res">>;
  };
