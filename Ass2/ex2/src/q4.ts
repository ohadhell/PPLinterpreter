import { isLetExp,isLitExp,PrimOp,CExp,VarDecl,AppExp,Exp, isBoolExp, isNumExp, isProgram,isProcExp, isVarRef,isIfExp, isStrExp, Program, isPrimOp, isVarDecl, isAppExp, isDefineExp } from '../imp/L3-ast';
import { Result, makeFailure, makeOk, bind } from '../shared/result';
import { is, map, zipWith } from "ramda";


/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [EXP | Program] => Result<string>
*/
export const l2ToPython = (exp: Exp | Program): Result<string>  => 
    makeOk(l2ToString(exp));
    
const unparseLExps = (les: Exp[]): string =>
    map(l2ToString, les).join(" ");

const unparseAppExp = (app:AppExp) : string =>{
    const op = app.rator;
    if (isPrimOp(op) && op.op !== "not") return `(${map((v:CExp) => l2ToString(v),app.rands).join(" "+unparsePrimExp(op)+" ")})`;
    if (isPrimOp(op) && op.op === "not") return `(not ${map((v:CExp) => l2ToString(v),app.rands)})`;
    return `${l2ToString(op)}(${map((v:CExp) => l2ToString(v),app.rands).join(",")})`;
}
const unparsePrimExp = (prim:PrimOp) : string =>{
    const op= prim.op;
    if (op === "number?") return `(lambda x : (type(x) == int or type(x) == float))`;
    if (op === "booelan?") return `(lambda x : (type(x) == bool))`;
    if (op === "eq?") return `==`;
    if (op === "and") return `&&`;
    if (op === "or") return `||`;
    if (op === "=") return `==`;
    return op;
}

const l2ToString = (exp: Exp | Program): string =>
    isProgram(exp) ? map(l2ToString,exp.exps).join("\n") :
    isBoolExp(exp) ? exp.val ? 'true' : 'false' :
    isVarRef(exp) || isVarDecl(exp) ? exp.var : 
    isStrExp(exp) ? exp.val :
    isPrimOp(exp) ? unparsePrimExp(exp) :
    isNumExp(exp) ? `${exp.val}` :
    isDefineExp(exp) ? exp.var.var + " = " + l2ToString(exp.val) :
    isIfExp(exp) ? `(${l2ToString(exp.then)} if ${l2ToString(exp.test)} else ${l2ToString(exp.alt)})` :
    isProcExp(exp) ? `(lambda ${map( (p: VarDecl) => p.var ,exp.args).join(",")} : ${unparseLExps(exp.body)})`:
    isAppExp(exp) ? unparseAppExp(exp) :
    '';