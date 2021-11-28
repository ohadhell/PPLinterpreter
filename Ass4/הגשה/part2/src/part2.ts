/* 2.1 */

import { convertToObject, createSourceFile, resolveProjectReferencePath } from "typescript";

export const MISSING_KEY = '___MISSING___'

type PromisedStore<K, V> = {
    get(key: K): Promise<V>,
    set(key: K, value: V): Promise<void>,
    delete(key: K): Promise<void>
}


export function makePromisedStore<K, V>(): PromisedStore<K, V> {
    const store = new Map();    //creating a new store and defining it's functions
    return {
        get(key: K) {
            return new Promise<V>( (resolve, reject) => {
                if(!store.has(key))
                    reject(MISSING_KEY);
                resolve(store.get(key));
            })
        },
        set(key: K, value: V) {
            return new Promise<void>((resolve) => {
                store.set(key,value);
                resolve();
            })
        },
        delete(key: K) {
            return new Promise<void>( (resolve, reject) => {
                if(!store.has(key))
                    reject(MISSING_KEY);
                store.delete(key);
                resolve();
            })
        },
    }
}

export function getAll<K, V>(store: PromisedStore<K, V>, keys: K[]): Promise<V[]> {
    const tmp:Promise<V>[] = keys.map(key => store.get(key))
    return Promise.all(tmp);
}

/* 2.2 */
//helper function for asycMemo
async function helper<T,R>(param: T, res:R , store:PromisedStore<T,R>): Promise<R> {
    try{//trying to get the param from the store using get
        return await store.get(param);
    }
    catch {//if there's no key that's equal to param, inserting it with value=res
        store.set(param,res);
        return store.get(param);//then return the new value inserted
    }
}
export function asycMemo<T, R>(f: (param: T) => R): (param: T) => Promise<R> {
    const store:PromisedStore<T,R> = makePromisedStore<T,R>();//creating a new promised store
    return ((key:T) => helper(key, f(key), store));
}
/* 2.3 */
export function lazyFilter<T>(genFn: () => Generator<T>, filterFn:(x:T) => boolean): () => Generator<T> {
    return function * gen(): Generator<T> {
        for(const n of genFn()){
            if(filterFn(n)){//yielding only generated values that predicates the filter function
                yield n;
            }
        }
    }
}

export function lazyMap<T, R>(genFn: () => Generator<T>, mapFn: (x:T) => R): () => Generator<R>{
    return function * gen(): Generator<R> {
        for(const n of genFn()){//yielding the 
            yield mapFn(n);
        }
    }
}

/* 2.4 */
//attempt 2 more times
async function retriesFun(fn:(x?:any)=>Promise<any>,attempt:number,val?:any,err?:any):Promise<any>{
    if(attempt == 3)
        throw err;
    try{
        const tmp:Promise<any> = new Promise((resolve) => setTimeout(()=>{
            resolve(fn(val));
        } ,2000));
        await tmp;
        return tmp;
    }
    catch(err){
        return retriesFun(fn,attempt+1,val,err);
    }
}
//helper function so we can handle all the functions that has 1 parameter
async function waterfallHelper(fns:[...{(x:any):Promise<any>}[]], valProm: Promise<any>):Promise<any> {
    if(fns.length == 0)
        return valProm;
    const val:any = await valProm;
    try{
        const res:Promise<any> = fns[0](val);
        await res;
        return waterfallHelper(fns.slice(1),res)
    }
    catch(err){
        try{
            const res:Promise<any> = retriesFun(fns[0],1,val);
            return waterfallHelper(fns.slice(1),res);
        }
        catch(err){
            throw err;
        }
    }
}
//main function, deals with the first function that recieves 0 paramaters, and then sends the rest of the
//functions to the helper function
export async function asyncWaterfallWithRetry(fns: [() => Promise<any>, ...{(x:any):Promise<any>}[]]): Promise<any> {
    const valProm:Promise<any> = fns[0]();
    try{
        await valProm;
        try{
            return waterfallHelper(fns.slice(1),valProm);
        }
        catch(err){
            throw err;
        }
    }
    catch{
        try{
            const res:Promise<any> = retriesFun(fns[0],1);
            await res;
            return waterfallHelper(fns.slice(1),res);
        }
        catch(err){
            throw err;
        }
    }
}