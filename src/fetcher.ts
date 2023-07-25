import { ReservedKeys, tsAPIOptions, Extract } from "./utils";
import { Fetcher, Routes, BaseFetcherOptions, EndpointTypes } from "./types";
import { parseURL } from "./parser";

// These are optional types if you want to extend the API

export function getAPI<T extends Partial<Routes>, Options extends Object = {}>(
  base: string,
  fetcher: Fetcher<Omit<Options, ReservedKeys>>,
) {
  type Defs = T;
  type ops = Omit<Options, ReservedKeys>;
  return {
    get: wrapper<
      Defs["GET"] extends Record<string, EndpointTypes>
        ? Defs["GET"]
        : Record<string, EndpointTypes>,
      ops
    >()(fetcher, base, "GET"),
    post: wrapper<
      Defs["POST"] extends Record<string, EndpointTypes>
        ? Defs["POST"]
        : Record<string, EndpointTypes>,
      ops
    >()(fetcher, base, "POST"),
    delete: wrapper<
      Defs["DELETE"] extends Record<string, EndpointTypes>
        ? Defs["DELETE"]
        : Record<string, EndpointTypes>,
      ops
    >()(fetcher, base, "DELETE"),
    put: wrapper<
      Defs["PUT"] extends Record<string, EndpointTypes>
        ? Defs["PUT"]
        : Record<string, EndpointTypes>,
      ops
    >()(fetcher, base, "PUT"),
    patch: wrapper<
      Defs["PATCH"] extends Record<string, EndpointTypes>
        ? Defs["PATCH"]
        : Record<string, EndpointTypes>,
      ops
    >()(fetcher, base, "PATCH"),
  };
}

const wrapper =
  <T extends Record<string, EndpointTypes>, O extends Object>() =>
  (fetcher: Fetcher<O & BaseFetcherOptions>, base: string, method: string) =>
  <U extends keyof T & string>(url: U, options?: tsAPIOptions<T, U, O>) => {
    const searchParams = new URLSearchParams(
      (options?.queries || {}) as Record<string, string>,
    );
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
    ) as Promise<T[U] extends EndpointTypes ? Extract<T[U], "res"> : unknown>;
  };

type routes = {
  GET: {
    "/users": {
      req: undefined;
      res: { name: string; age: number };
      queries: { name: string };
    };
  };
};

const api = getAPI<routes>("https://example.com", fetch);

api.get("/users");
