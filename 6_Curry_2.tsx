import { FC } from "react";
/**
 * Article: https://catchts.com/currying-components#currying_react_components
 */

type BaseProps = {
  isOpen: boolean;
};

const WithTitle: FC<BaseProps & { title: string }> = (props) => null
const WithCount: FC<BaseProps & { count: number }> = (props) => null

// credits goes to https://stackoverflow.com/a/50375286
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type GetRequired<T> = UnionToIntersection<
  // make sure we have a deal with array
  T extends Array<infer F>
    ? // make sure that element in the array extends FC
      F extends FC<infer Props>
      ? // if Props extends BaseProps
        Props extends BaseProps
        ? // Omit isOpen property, since it is not needed
          Omit<Props, "isOpen">
        : never
      : never
    : never
>;
{
  type Test = keyof GetRequired<
    [FC<BaseProps & { title: string }>, FC<BaseProps & { count: number }>]
  >; // "title" | "count"
}

type ExtractProps<F extends FC<any>> = F extends FC<infer Props>
  ? Props
  : never;
{
  type Test = ExtractProps<FC<{ age: number }>>; // { age: number }
}

type IsValid<Components extends Array<FC<BaseProps>>> = ExtractProps<
  [...Components][number]
> extends BaseProps
  ? Components
  : never;
{
  type Test1 = IsValid<[FC<unknown>]>; // never
  type Test2 = IsValid<[FC<BaseProps>]>; //[React.FC<BaseProps>]
}

const Curry =
  <Comps extends FC<any>[], Valid extends IsValid<Comps>>(
    /**
     * If each Component expects BaseProps,
     * sections argument will evaluate to [...Comps] & [...Comps],
     * otherwise to [...Comps] & never === never
     */
    sections: [...Comps] & Valid
  ) =>
  (props: GetRequired<[...Comps]>) =>
    (
      <>
        {sections.map((Comp: FC<BaseProps>) => (
          <Comp isOpen={true} {...props} /> // isOpen is required
        ))}
      </>
    );

const Container = Curry([WithCount, WithTitle]);

const result = <Container title={"hello"} count={42} />; // ok

const result_ = <Container title={"hello"} count={"42"} />; // expected error

const Container_ = Curry([WithCount, () => null]); // expected error
