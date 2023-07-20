import { ReservedKeys, tsAPI, tsAPIOptions } from "./utils";
import { Method, Fetcher, Routes } from "./types";
import { parseURL } from "./parser";

// These are optional types if you want to extend the API

export function getAPI<T extends Partial<Routes>, Options extends Object = {}>(
  base: string,
  fetcher: Fetcher<Omit<Options, ReservedKeys> | {}>,
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
  <T extends Method, O extends Object>() =>
  <U extends keyof T & string>(
    fetcher: Fetcher<tsAPIOptions<T, U, O> | {}>,
    base: string,
    method: string,
  ) => {
    return ((url: U, options?: tsAPIOptions<T, U, O>) => {
      const fullURL = new URL(parseURL(url), base);
      Object.keys(options?.queries || {}).forEach((key) => {
        fullURL.searchParams.append(key, (options!.queries as any)[key]);
      });
      return fetcher(fullURL.toString(), {
        ...(options ? options : {}),
        method,
      });
    }) as tsAPI<T, U, O>;
  };
