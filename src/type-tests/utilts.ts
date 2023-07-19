import { Method } from "../types";
import {
  HasRequiredKeys,
  Extract,
  PathParams,
  ConditionalOptional,
  tsAPIOptions,
} from "../utils";
import { Fail, Pass, check, checks } from "./test-utils";

/**
 * HasRequiredKeys
 */
checks([
  check<HasRequiredKeys<{}>, false, Pass>(),
  check<HasRequiredKeys<{}>, true, Fail>(),

  check<HasRequiredKeys<{ a: string }>, true, Pass>(),
  check<HasRequiredKeys<{ a: string }>, false, Fail>(),
  check<HasRequiredKeys<{ a?: string }>, false, Pass>(),
  check<HasRequiredKeys<{ a?: string }>, true, Fail>(),

  check<HasRequiredKeys<{ a: string; b: string }>, true, Pass>(),
  check<HasRequiredKeys<{ a: string; b: string }>, false, Fail>(),
  check<HasRequiredKeys<{ a?: string; b: string }>, true, Pass>(),
  check<HasRequiredKeys<{ a?: string; b: string }>, false, Fail>(),
  check<HasRequiredKeys<{ a: string; b?: string }>, true, Pass>(),
  check<HasRequiredKeys<{ a: string; b?: string }>, false, Fail>(),
  check<HasRequiredKeys<{ a?: string; b?: string }>, false, Pass>(),
  check<HasRequiredKeys<{ a?: string; b?: string }>, true, Fail>(),
]);

/**
 * Path Params
 */
checks;
type PathParamRoutes = Method<{
  "/": {};
  "/ping": {};
  "/docs/help/faq": {};
  "/{slug}": {};
  "/{slug}/{id}/about": {};
  "/{slug}/{id}/about/{page_id}": {};
  "/tests/{?id}": {};
  "/tests/{?id}/{page_id}": {};
  "/tests/{id}/{?page}": {};
}>;

checks([
  check<PathParams<PathParamRoutes, "/">, never, Pass>(),
  check<PathParams<PathParamRoutes, "/">, Record<"slug", string>, Fail>(),
  check<PathParams<PathParamRoutes, "/ping">, never, Pass>(),
  check<PathParams<PathParamRoutes, "/ping">, Record<"slug", string>, Fail>(),
  check<PathParams<PathParamRoutes, "/docs/help/faq">, never, Pass>(),
  check<
    PathParams<PathParamRoutes, "/docs/help/faq">,
    Record<"slug", string>,
    Fail
  >(),
  check<PathParams<PathParamRoutes, "/{slug}">, Record<"slug", string>, Pass>(),
  check<
    PathParams<PathParamRoutes, "/{slug}">,
    Record<"slug", string> | Record<"id", string>,
    Fail
  >(),
  check<
    PathParams<PathParamRoutes, "/{slug}/{id}/about">,
    Record<"slug", string> | Record<"id", string>,
    Pass
  >(),
  check<
    PathParams<PathParamRoutes, "/{slug}/{id}/about">,
    Record<"slug", string>,
    Fail
  >(),
  check<
    PathParams<PathParamRoutes, "/{slug}/{id}/about">,
    Record<"slug", string> | Record<"id", string> | Record<"page_id", string>,
    Fail
  >(),
  check<
    PathParams<PathParamRoutes, "/{slug}/{id}/about/{page_id}">,
    Record<"slug", string> | Record<"id", string> | Record<"page_id", string>,
    Pass
  >(),
  check<
    PathParams<PathParamRoutes, "/tests/{?id}">,
    Partial<Record<"id", string>>,
    Pass
  >(),
  check<
    PathParams<PathParamRoutes, "/tests/{?id}">,
    Record<"id", string>,
    Fail
  >(),
  check<
    PathParams<PathParamRoutes, "/tests/{?id}/{page_id}">,
    Partial<Record<"id", string>> | Record<"page_id", string>,
    Pass
  >(),
  check<
    PathParams<PathParamRoutes, "/tests/{?id}/{page_id}">,
    Record<"id", string>,
    Fail
  >(),
  check<
    PathParams<PathParamRoutes, "/tests/{id}/{?page}">,
    Partial<Record<"page", string>> | Record<"id", string>,
    Pass
  >(),
  check<
    PathParams<PathParamRoutes, "/tests/{id}/{?page}">,
    Record<"id", string>,
    Fail
  >(),
]);

/**
 * Extract
 */
checks([
  check<
    Extract<
      {
        req: { a: string };
        res: { b: string };
      },
      "req"
    >,
    { a: string },
    Pass
  >(),
  check<
    Extract<
      {
        req: { a: string };
        res: { b: string };
      },
      "req"
    >,
    { b: string },
    Fail
  >(),
  check<
    Extract<
      {
        req: { a: string };
        res: { b: string };
      },
      "res"
    >,
    { b: string },
    Pass
  >(),
  check<
    Extract<
      {
        req: { a: string };
        res: { b: string };
      },
      "res"
    >,
    { a: string },
    Fail
  >(),
]);

/**
 * ConditionalOptional
 */
checks([
  check<
    ConditionalOptional<"a", { b: string }>,
    Record<"a", { b: string }>,
    Pass
  >(),
  check<
    ConditionalOptional<"a", { b: string }>,
    Partial<Record<"a", { b: string }>>,
    Fail
  >(),
  check<
    ConditionalOptional<"a", { b?: string }>,
    Partial<Record<"a", { b?: string }>>,
    Pass
  >(),
  check<
    ConditionalOptional<"a", { b?: string }>,
    Record<"a", { b?: string }>,
    Fail
  >(),
  check<
    ConditionalOptional<"a", { b: string; c: string }>,
    Record<"a", { b: string; c: string }>,
    Pass
  >(),
  check<
    ConditionalOptional<"a", { b: string; c: string }>,
    Partial<Record<"a", { b: string; c: string }>>,
    Fail
  >(),
  check<
    ConditionalOptional<"a", { b?: string; c: string }>,
    Record<"a", { b?: string; c: string }>,
    Pass
  >(),
  check<
    ConditionalOptional<"a", { b?: string; c: string }>,
    Partial<Record<"a", { b?: string; c: string }>>,
    Fail
  >(),
]);

/**
 * tsAPIOptions
 */
checks([
  check<
    tsAPIOptions<
      {
        GET: {
          req: { a: string };
          res: { b: string };
        };
      },
      "GET",
      {}
    >,
    Partial<Record<"queries", unknown>> &
      Record<
        "body",
        {
          a: string;
        }
      > &
      Partial<Record<"params", unknown>>,
    Pass
  >(),
  check<
    tsAPIOptions<
      {
        GET: {};
      },
      "GET",
      {}
    >,
    Partial<Record<"queries", unknown>> &
      Partial<Record<"body", unknown>> &
      Partial<Record<"params", unknown>>,
    Pass
  >(),
  check<
    tsAPIOptions<
      {
        GET: {
          req: { a: string };
        };
      },
      "GET",
      {}
    >,
    Partial<Record<"queries", unknown>> &
      Record<
        "body",
        {
          a: string;
        }
      > &
      Partial<Record<"params", unknown>>,
    Pass
  >(),
  check<
    tsAPIOptions<
      {
        GET: {
          res: { b: string };
        };
      },
      "GET",
      {}
    >,
    Partial<Record<"queries", unknown>> &
      Partial<Record<"body", unknown>> &
      Partial<Record<"params", unknown>>,
    Pass
  >(),
  check<
    tsAPIOptions<
      {
        GET: {
          queries: { a: string };
        };
      },
      "GET",
      {}
    >,
    Record<"queries", { a: string }> &
      Partial<Record<"body", unknown>> &
      Partial<Record<"params", unknown>>,
    Pass
  >(),
  check<
    tsAPIOptions<
      {
        GET: {
          queries: { a: string };
          req: { b: string };
        };
      },
      "GET",
      {}
    >,
    Record<"queries", { a: string }> &
      Record<
        "body",
        {
          b: string;
        }
      > &
      Partial<Record<"params", unknown>>,
    Pass
  >(),
  check<
    tsAPIOptions<
      {
        GET: {
          queries?: { a: string };
          req?: { b: string };
          res?: { c: string };
        };
      },
      "GET",
      {}
    >,
    Partial<Record<"queries", { a: string }>> &
      Partial<Record<"body", { b: string }>> &
      Partial<Record<"params", unknown>>,
    Pass
  >(),
  check<
    tsAPIOptions<
      {
        GET: {
          queries: { a?: string };
          req: { b?: string };
          res: { c?: string };
        };
      },
      "GET",
      {}
    >,
    Partial<Record<"queries", { a?: string }>> &
      Partial<Record<"body", { b?: string }>> &
      Partial<Record<"params", unknown>>,
    Pass
  >(),
]);
