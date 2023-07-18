import { HasRequiredKeys, ExtractReq, ExtractRes } from "../utils";
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
 * ExtractReq
 */
checks([
  check<
    ExtractReq<{
      req: { a: string };
      res: { b: string };
    }>,
    { a: string },
    Pass
  >(),
  check<
    ExtractReq<{
      req: { a: string };
      res: { b: string };
    }>,
    { b: string },
    Fail
  >(),
]);

/**
 * ExtractRes
 */
checks([
  check<
    ExtractRes<{
      req: { a: string };
      res: { b: string };
    }>,
    { a: string },
    Fail
  >(),
  check<
    ExtractRes<{
      req: { a: string };
      res: { b: string };
    }>,
    { b: string },
    Pass
  >(),
]);
