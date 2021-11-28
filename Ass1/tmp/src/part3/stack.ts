import { State, bind } from "./state";

export type Stack = number[];

export const push = (x:number) : State<Stack, undefined> => {
    const state:State<Stack,undefined> = (initialValue: Stack) => {
        return [[x].concat(initialValue),undefined];
    }
    return state;
};

export const pop:State<Stack,number> = (x:Stack) => {
    const pooped = x[0];
    return [x.slice(1), pooped];
};

export const stackManip:State<Stack,undefined> = (s:Stack) => {//binding the methods in the required sequence
    return bind( pop, (x:number) => bind( push(x*x), () => bind( pop, (y:number) => push(y+x))))(s);
};