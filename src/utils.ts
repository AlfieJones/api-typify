import { EndpointTypes } from "./types";

type RequiredLiteralKeys<T> = keyof {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : {} extends Pick<T, K>
    ? never
    : K]: 0;
};

export type HasRequiredKeys<T> = RequiredLiteralKeys<T> extends never
  ? false
  : true;

export type PathParams<
  T extends Record<string, EndpointTypes>,
  U extends keyof T,
> = U extends `${infer _V}{${infer W}}${infer X}`
  ? W extends `?${infer Y}`
    ? Partial<Record<Y, string>> | PathParams<T, X>
    : Record<W, string> | PathParams<T, X>
  : never;

export type Extract<
  T extends EndpointTypes,
  K extends keyof T,
> = T extends undefined ? undefined : T[K];

export type ReservedKeys = "params" | "body" | "queries";

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type ConditionalOptional<K extends string, V> = K extends
  | undefined
  | never
  ? Partial<Record<K, V>>
  : HasRequiredKeys<V> extends true
  ? Record<K, V>
  : Partial<Record<K, V>>;

export type tsAPIOptions<
  T extends Record<string, EndpointTypes>,
  U extends keyof T,
  FetcherOptions extends Object,
> = ConditionalOptional<"queries", Extract<T[U], "queries">> &
  ConditionalOptional<"body", Extract<T[U], "req">> &
  ConditionalOptional<"params", UnionToIntersection<PathParams<T, U>>> &
  FetcherOptions;

// If either body or params isn't required, then the type of the options argument should be optional
export type tsAPI<
  T extends Record<string, EndpointTypes>,
  U extends keyof T,
  O extends Object,
> = HasRequiredKeys<tsAPIOptions<T, U, O>> extends true
  ? (url: U, options: tsAPIOptions<T, U, O>) => Promise<T[U]["res"]>
  : (url: U, options?: tsAPIOptions<T, U, O>) => Promise<T[U]["res"]>;
