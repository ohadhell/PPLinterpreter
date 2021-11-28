import * as R from "ramda";

const stringToArray: (str: string) => string[] = R.split("");

const vowels:string[] = ['A','E','I','O','U','a','e','i','o','u'];
const isVowel:(ch:string) => Boolean = (ch:string) => vowels.some(curr => ch == curr);
/* Question 1 */
export const countVowels: (str:string) => number = R.pipe(
    (str:string) => stringToArray(str),
    (arr:string[]) => arr.reduce((acc:number,curr:string) => isVowel(curr) ? acc + 1 : acc, 0)    
);

const countRepeat = (str:string[],ch:string):number => {
    if(str.length == 0)
        return 0;
    else{
        if(str[0] == ch)
            return (1 + countRepeat(str.slice(1), ch));
    }
    return 0;
}
const total = (str:string[]):string => {
    if(str.length == 0) return "";
    const count = countRepeat(str,str[0]);
    if(count == 1)
        return str[0] + total(str.slice(count));
    return str[0] + count + total(str.slice(count));
}

/* Question 2 */
export const runLengthEncoding = R.pipe(
    (str:string) => stringToArray(str),
    (arr:string[]) => total(arr) 
);


const opener:string[] = ['(','[','{'];
const closer:string[] = [')',']','}'];
const brackets:string[] =opener.concat(closer);
const isbrackets:(ch:string) => Boolean = (ch:string) => brackets.some(curr => ch == curr);
const isOpener:(ch:string) => Boolean = (ch:string) => opener.some(curr => ch == curr);
const isLegal:(first:string,second:string) => Boolean= (first:string,second:string) => opener.indexOf(first)==closer.indexOf(second);

const recBrackets:(str:string[], toCheck:string) => Boolean = (str:string[], toCheck:string) => {
    if(str.length == 0)
        return toCheck == '';
    if(isOpener(str[0]))
        return recBrackets(str.slice(1), toCheck + str[0]);
    if(!isLegal(toCheck.slice(toCheck.length - 1), str[0]))
        return false;
    else
        return recBrackets(str.slice(1),toCheck.slice(0,toCheck.length-1));
};

/* Question 3 */
export const isPaired :(sentance:string) => Boolean = R.pipe(
    (str:string) => stringToArray(str),
    (arr:string[]) => arr.filter(isbrackets),
    (arr:string[]) => recBrackets(arr,"")
);