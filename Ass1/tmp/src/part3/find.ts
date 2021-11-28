import { Result, makeFailure, makeOk, bind, either } from "../lib/result";

/* Library code */
const findOrThrow = <T>(pred: (x: T) => boolean, a: T[]): T => {
    for (let i = 0; i < a.length; i++) {
        if (pred(a[i])) return a[i];
    }
    throw "No element found.";
}


export const findResult = <T>(pred: (x: T) => boolean, a: T[]): Result<T> =>{
    const tmp = a.find(pred);//tmp will be undefined if no T in "a" predicates
    if(tmp === undefined) return makeFailure("No element that the predicate returns true for");
    return makeOk(tmp);
};

/* Client code */
const returnSquaredIfFoundEven_v1 = (a: number[]): number => {
    try {
        const x = findOrThrow(x => x % 2 === 0, a);
        return x * x;
    } catch (e) {
        return -1;
    }
}

export const returnSquaredIfFoundEven_v2 = (a: number[]): Result<number> =>{
    return bind(findResult(result => result % 2 === 0, a),x => makeOk(x*x));
};

export const returnSquaredIfFoundEven_v3 = (a: number[]): number =>{
    return either(findResult(result => result % 2 === 0, a),x => x*x, x=>-1);
};