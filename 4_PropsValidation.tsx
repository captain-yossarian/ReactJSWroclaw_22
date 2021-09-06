import React from "react";

// Let's say we have a component which expects foo and bar properties to be strings, but property foo can't be hello.
type Props<F extends string = "", B extends string = ""> = {
  foo: F;
  bar: B;
};

type ConditionalProps<T> = T extends { foo: infer Foo; bar: string }
  ? Foo extends "hello"
    ? { foo: never; bar: string }
    : T
  : never;

const Example = <F extends string, B extends string>(
  props: ConditionalProps<Props<F, B>>
) => null;

const Test = () => {
  <>
    <Example foo="not hello" bar="1" /> // ok
    <Example foo="hello" bar="bye" /> // expected error
  </>;
};
