// Testing method from https://github.com/millsp/ts-toolbelt

export type Boolean = 0 | 1;

export type Equals<A1 extends any, A2 extends any> = (<A>() => A extends A2
  ? 1
  : 0) extends <A>() => A extends A1 ? 1 : 0
  ? 1
  : 0;

export type Pass = 1;

export type Fail = 0;

// Check or test the validity of a type
export declare function check<Type, Expect, Outcome extends Boolean>(
  debug?: Type,
): Equals<Equals<Type, Expect>, Outcome>;

// Validates a batch of [[check]]
export declare function checks(checks: 1[]): void;
