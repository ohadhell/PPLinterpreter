import { stat } from "node:fs";
import { State, bind } from "./state";

export type Queue = number[];

export const enqueue = (x:number) : State<Queue, undefined>=>{
    const state:State<Queue,undefined> =((initialState:Queue)=>{
        return [initialState.concat([x]),undefined];
    })
    return state;
};

export const dequeue:State<Queue,number> = (x:Queue) =>{
    const removed=x[0];
    return [x.slice(1),removed];
};

export const queueManip:State<Queue,number> = (x:Queue) => {//binding the methods in the required sequence
    return bind(dequeue, (y:number) => bind(enqueue(y*2), () => bind(enqueue(y/3), () => dequeue)))(x);
};
