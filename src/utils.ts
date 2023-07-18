import { EndpointTypes } from "./types";

export type PathParams<
  T extends Record<string, EndpointTypes>,
  U extends keyof T,
> = U extends `${infer _V}{${infer W}}${infer X}`
  ? W extends `?${infer Y}`
    ? Partial<Record<Y, string>> | PathParams<T, X>
    : Record<W, string> | PathParams<T, X>
  : never;

export type ExtractReq<T extends EndpointTypes> = T extends undefined
  ? undefined
  : T["req"];

export type ExtractRes<T extends EndpointTypes> = T["res"];

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type OptionalParams<
  T extends Record<string, EndpointTypes>,
  U extends keyof T,
> = PathParams<T, U> extends never
  ? { params?: undefined }
  : { params: UnionToIntersection<PathParams<T, U>> };

export type OptionalBody<
  T extends Record<string, EndpointTypes>,
  U extends keyof T,
> = ExtractReq<T[U]> extends undefined
  ? { body?: undefined }
  : { body: ExtractReq<T[U]> };

export type RequiredLiteralKeys<T> = keyof {
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
