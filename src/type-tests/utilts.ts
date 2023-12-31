import {
  HasRequiredKeys,
  Extract,
  PathParams,
  ConditionallyOptional,
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
checks([
  check<PathParams<"/">, never, Pass>(),
  check<PathParams<"/">, Record<"slug", string>, Fail>(),
  check<PathParams<"/ping">, never, Pass>(),
  check<PathParams<"/ping">, Record<"slug", string>, Fail>(),
  check<PathParams<"/docs/help/faq">, never, Pass>(),
  check<PathParams<"/docs/help/faq">, Record<"slug", string>, Fail>(),
  check<PathParams<"/{slug}">, Record<"slug", string>, Pass>(),
  check<
    PathParams<"/{slug}">,
    Record<"slug", string> | Record<"id", string>,
    Fail
  >(),
  check<
    PathParams<"/{slug}/{id}/about">,
    Record<"slug", string> | Record<"id", string>,
    Pass
  >(),
  check<PathParams<"/{slug}/{id}/about">, Record<"slug", string>, Fail>(),
  check<
    PathParams<"/{slug}/{id}/about">,
    Record<"slug", string> | Record<"id", string> | Record<"page_id", string>,
    Fail
  >(),
  check<
    PathParams<"/{slug}/{id}/about/{page_id}">,
    Record<"slug", string> | Record<"id", string> | Record<"page_id", string>,
    Pass
  >(),
  check<PathParams<"/tests/{?id}">, Partial<Record<"id", string>>, Pass>(),
  check<PathParams<"/tests/{?id}">, Record<"id", string>, Fail>(),
  check<
    PathParams<"/tests/{?id}/{page_id}">,
    Partial<Record<"id", string>> | Record<"page_id", string>,
    Pass
  >(),
  check<PathParams<"/tests/{?id}/{page_id}">, Record<"id", string>, Fail>(),
  check<
    PathParams<"/tests/{id}/{?page}">,
    Partial<Record<"page", string>> | Record<"id", string>,
    Pass
  >(),
  check<PathParams<"/tests/{id}/{?page}">, Record<"id", string>, Fail>(),
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
 * ConditionallyOptional
 */
checks([
  check<
    ConditionallyOptional<"a", { b: string }>,
    Record<"a", { b: string }>,
    Pass
  >(),
  check<
    ConditionallyOptional<"a", { b: string }>,
    Partial<Record<"a", { b: string }>>,
    Fail
  >(),
  check<
    ConditionallyOptional<"a", { b?: string }>,
    Partial<Record<"a", { b?: string }>>,
    Pass
  >(),
  check<
    ConditionallyOptional<"a", { b?: string }>,
    Record<"a", { b?: string }>,
    Fail
  >(),
  check<
    ConditionallyOptional<"a", { b: string; c: string }>,
    Record<"a", { b: string; c: string }>,
    Pass
  >(),
  check<
    ConditionallyOptional<"a", { b: string; c: string }>,
    Partial<Record<"a", { b: string; c: string }>>,
    Fail
  >(),
  check<
    ConditionallyOptional<"a", { b?: string; c: string }>,
    Record<"a", { b?: string; c: string }>,
    Pass
  >(),
  check<
    ConditionallyOptional<"a", { b?: string; c: string }>,
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
      Partial<Record<"params", unknown>> & { method?: string },
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
      Partial<Record<"params", unknown>> & { method?: string },
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
      Partial<Record<"params", unknown>> & { method?: string },
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
      Partial<Record<"params", unknown>> & { method?: string },
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
      Partial<Record<"params", unknown>> & { method?: string },
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
      Partial<Record<"params", unknown>> & { method?: string },
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
      Partial<Record<"params", unknown>> & { method?: string },
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
      Partial<Record<"params", unknown>> &
      Partial<Record<"params", unknown>> & { method?: string },
    Pass
  >(),
]);
