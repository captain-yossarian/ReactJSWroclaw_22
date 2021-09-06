import  { FC } from 'react'

/**
 * Article: https://catchts.com/react-props
 */

enum Mode {
    easy = 'easy',
    medium = 'medium',
    hard = 'hard'
}

type A = {
    mode: Mode.easy;
    check: (a: string) => string
}

type B = {
    mode: Mode.medium;
    check: (a: number) => number
}

type C = {
    mode: Mode.hard;
    check: (a: symbol) => symbol
}

type Props = A | B | C;


{
    /**
     * Small test
     */
    const Comp: FC<Props> = (props) => {
        if (props.mode === Mode.easy) {
            const x = props // A
        }

        if (props.mode === Mode.medium) {
            const x = props // B
        }

        if (props.mode === Mode.hard) {
            const x = props // C
        }
        props.check() // error

        return null
    }
}

type Fn = (...args: any[]) => any

// 1. Get key name where property is a function. 
type FnProps<T> = {
    [Prop in keyof T]: T[Prop] extends Fn ? Prop : never
}[keyof T]

{
    type Test = FnProps<Props>
}

type Values<T> = T[keyof T]

// 2. Get union of all functions.
type FnUnion<PropsUnion> = Values<Pick<PropsUnion, FnProps<PropsUnion>>>
{

    // | ((a: string) => string) 
    // | ((a: number) => number) 
    // | ((a: symbol) => symbol)
    type Test = FnUnion<Props>
}

// 3. Compute less specific overload
type ParametersUnion<PropsUnion> =
    FnUnion<PropsUnion> extends Fn
    ? (a: Parameters<FnUnion<PropsUnion>>[0]) =>
        ReturnType<FnUnion<PropsUnion>>
    : never
{

    // (a: string | number | symbol) => string | number | symbol
    type Test = ParametersUnion<Props>
}

// credits goes to https://stackoverflow.com/a/50375286
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;
    
// 4. In order to convert function union to overloads, we need to use intersection instead of union
type Overload<PropsUnion> =
    & UnionToIntersection<PropsUnion[FnProps<PropsUnion>]>
    & ParametersUnion<PropsUnion>
{

    // & ((a: string) => string) 
    // & ((a: number) => number) 
    // & ((a: symbol) => symbol) 
    // & ((a: string | number | symbol) => string | number | symbol)
    type Test = Overload<Props>
}

type OverloadedProps<PropsUnion> =
    & PropsUnion
    & Record<FnProps<PropsUnion>, Overload<PropsUnion>>
{
    // Props & Record<"check", Overload<Props>>
    type Test = OverloadedProps<Props>
}

const Comp: FC<OverloadedProps<Props>> = (props) => {
    const { mode, check } = props;

    if (mode === Mode.easy) {
        props.check(2) // flaw
    }

    const result = check(2) // string | number

    return null
}