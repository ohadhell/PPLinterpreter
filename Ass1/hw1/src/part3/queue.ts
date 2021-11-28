import { stat } from "node:fs";
import { State, bind } from "./state";

export type Queue = number[];

export const enqueue = (x:number) : State<Queue, undefined>=>{
    const state:State<Queue,undefined> =((initialState:Queue)=>{
        return [initialState.concat([x]),undefined];
    })
    return state;
};

export const dequeue = (x:Queue) : [Queue,number]=>{
    const removed=x[0];
    return [x.slice(1),removed];
};

export const queueManip = (x:Queue) :  State<Queue, undefined>=>{
    const tmp = bind((initialState) => dequeue(initialState),() => enqueue(x[0]*2));
    console.log(tmp(x));
    return tmp;
};

// export const queueManip2 = (x:Queue) :  State<Queue, undefined>=>{
//     const dqu:[Queue,number]= dequeue(x);
//     const tmp=bind(enqueue(dqu[1]*2),()=>enqueue(dqu[1]/2));
//     console.log(tmp(x));
//     const state:State<Queue,undefined> =((initialState:State<Queue, undefined>)=>{
//         const tmp= bind(initialState,()=>enqueue(dqu[1]*2));
//         const tmp2=bind(tmp,()=>enqueue(dqu[1]/2));
//         return [initialState,undefined];
//         // const tmp3=bind(tmp2,()=>)
//     })
//     // console.log(bind(enqueue(dqu[1]),second=>bind(enqueue(dqu[1]),third=>))(x));
//     return state;
// };
//[ [ 6, 7, 8, 6 ], undefined ]