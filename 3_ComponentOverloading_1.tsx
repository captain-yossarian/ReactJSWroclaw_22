/**
 * Article: https://catchts.com/type-negation
 */

// Let's say we have Animal component with next constraints:

// If dogName is empty string or unset, canBark should be false
// If dogName is not empty string, canBark should be true

type NonEmptyString<T extends string> = T extends "" ? never : T;

type WithName = {
  dogName: string;
  canBark: true;
};

type WithoutName = {
  dogName?: "";
  canBark: false;
};

type Props = WithName | WithoutName;

type Overloadings = ((arg: { canBark: false }) => JSX.Element) &
  ((arg: { dogName: ""; canBark: false }) => JSX.Element) &
  (<S extends string>(arg: {
    dogName: NonEmptyString<S>;
    canBark: true;
  }) => JSX.Element);

// Intersection of FC will not work in this case because we need to infer dogName and validate it
const Animal: Overloadings = (props: Props) => <div></div>;

const Test = () => (
  <>
    <Animal dogName="" canBark={false} /> // ok
    <Animal dogName="a" canBark={true} /> // ok
    <Animal canBark={false} /> // ok
    <Animal dogName="a" canBark={false} /> // error
    <Animal dogName="" canBark={true} /> // error
    <Animal canBark={true} /> // error
  </>
);

/**
 * We often forget that we can use generics in React components
 */
type CustomProps<T> = {
  tag: T;
  onClick: (elem: T) => void;
};
const SomeObject = <T,>(props: CustomProps<T>) => null;

const jsx = (
  <SomeObject tag={"hello"} onClick={(elem /** string */) => void 0} />
);
