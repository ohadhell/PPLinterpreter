import { stat } from "node:fs";
import { F } from "ramda";

export type State<S, A> = (initialState: S) => [S, A];

export const bind= <S, A, B>(state: State<S, A>, f: (x: A) => State<S, B>) : State<S, B>=>{
    const tmp:State<S,B>= ((initialState: S) =>{
      return f(state(initialState)[1])(state(initialState)[0]);
      // return [initialState,f(state(initialState)[1])(initialState)[1]];
    })
    return tmp;
};


