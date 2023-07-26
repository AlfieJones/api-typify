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

export type PathParams<U> = U extends `${infer _V}{${infer W}}${infer X}`
  ? W extends `?${infer Y}`
    ? Partial<Record<Y, string>> | PathParams<X>
    : Record<W, string> | PathParams<X>
  : never;

export type Extract<T extends EndpointTypes, K extends keyof T> = T[K];

export type ReservedKeys = "params" | "body" | "queries";

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type ConditionallyOptional<K extends string, V> = K extends
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
> = ConditionallyOptional<"queries", Extract<T[U], "queries">> &
  ConditionallyOptional<"body", Extract<T[U], "req">> &
  ConditionallyOptional<"params", UnionToIntersection<PathParams<U>>> &
  FetcherOptions & { method?: string };
