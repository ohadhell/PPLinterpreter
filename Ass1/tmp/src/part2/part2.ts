import * as R from "ramda";

const stringToArray: (str: string) => string[] = R.split("");

const vowels:string[] = ['A','E','I','O','U','a','e','i','o','u'];//array of all vowel letters
const isVowel:(ch:string) => boolean = (ch:string) => vowels.some(curr => ch == curr);
/* Question 1 */
export const countVowels: (str:string) => number = R.pipe(//counting the vowels using reduce and is vowel
    (str:string) => stringToArray(str),
    (arr:string[]) => arr.reduce((acc:number,curr:string) => isVowel(curr) ? acc + 1 : acc, 0)    
);

const countRepeat = (str:string[],ch:string):number => {//recursive counter
    if(str.length == 0)
        return 0;
    else{
        if(str[0] == ch)
            return R.add(1,countRepeat(str.slice(1), ch));
    }
    return 0;
}
const total = (str:string[]):string => {//checking each letter for sequence appearance 
    if(str.length == 0) return "";
    const count = countRepeat(str,str[0]);
    if(count == 1)//if no sequence found- there's no need to add the number after the letter
        return R.concat(str[0],(total(str.slice(count))));
    return R.concat(str[0],R.concat((R.toString(count)),(total(str.slice(count)))));//moving to the next letter
}

/* Question 2 */
export const runLengthEncoding = R.pipe(
    (str:string) => stringToArray(str),
    (arr:string[]) => total(arr) 
);


const opener:string[] = ['(','[','{'];
const closer:string[] = [')',']','}'];
const brackets:string[] = opener.concat(closer);//array of all brackets
const isbrackets:(ch:string) => boolean = (ch:string) => brackets.some(curr => ch == curr);
const isOpener:(ch:string) => boolean = (ch:string) => opener.some(curr => ch == curr);
//is legal- checking if the brackets match the type of each other
const isLegal:(first:string,second:string) => boolean= (first:string,second:string) => opener.indexOf(first)==closer.indexOf(second);

const recBrackets:(str:string[], toCheck:string) => boolean = (str:string[], toCheck:string) => {
    if(str.length == 0)
        return toCheck == '';
    if(isOpener(str[0]))//if another bracket opened, continue the recursive method
        return recBrackets(str.slice(1), R.concat(toCheck,str[0]));
    if(!isLegal(toCheck.slice(toCheck.length - 1), str[0]))//if the brackets does not match
        return false;//return false
    else//otherwise, they match, so continue the check
        return recBrackets(str.slice(1),toCheck.slice(0,toCheck.length-1));
};

/* Question 3 */
export const isPaired :(sentance:string) => boolean = R.pipe(//piping all the helping functions
    (str:string) => stringToArray(str),
    (arr:string[]) => R.filter(isbrackets,arr),
    (arr:string[]) => recBrackets(arr,"")
);