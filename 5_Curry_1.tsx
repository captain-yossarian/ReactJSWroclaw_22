import { FC } from "react";
/**
 * Article: https://catchts.com/currying-components#typing_factory
 */


type ToRecord<
  T extends string[],
  Cache extends Record<string, number> = {}
> = T extends []
  ? Cache
  : T extends [...infer Head, infer Last]
  ? Last extends string
    ? Head extends string[]
      ? ToRecord<Head, Cache & Record<Last, Head["length"]>>
      : never
    : never
  : never;
{
  // Record<"hi", 2> & Record<"holla", 1> & Record<"hello", 0>
  type Test = ToRecord<["hello", "holla", "hi"]>;
}

const Curry =
  <Elem extends string, Data extends Elem[]>(
    data: [...Data]
  ): FC<ToRecord<Data>> =>
  (props) =>
    (
      <div>
        {Object.keys(props).map((elem) => (
          <p>{elem}</p>
        ))}
      </div>
    );

const Result = Curry(["hello", "holla", "hi"]); // FC<{ greeting: string; }>

// hello - is a required property
const jsx = <Result hello={0} holla={1} hi={2} />;
