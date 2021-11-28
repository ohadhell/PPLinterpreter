import { /*ClassExp, ProcExp, */ Exp, Program ,ClassExp, ProcExp,CExp} from "./L31-ast";
import { Result, makeFailure, makeOk } from "../shared/result";
import { map, zipWith } from "ramda";
import {makeSymbolSExp} from "../imp/L3-value";
import * as l31 from "./L31-ast";

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/

const lambdaToIf = (tests:l31.AppExp[], then:CExp[]): CExp => {
    if(tests.length === 1) return l31.makeIfExp(tests[0],l31.makeAppExp(then[0],[]),l31.makeBoolExp(false));
    return l31.makeIfExp(tests[0],l31.makeAppExp(then[0],[]),lambdaToIf(tests.slice(1),then.slice(1)));
}

export const class2proc = (exp: ClassExp): ProcExp =>{
    const vars = exp.fields;
    const then= map((b: l31.Binding) => b.val,exp.methods);    
    const test = map((b: l31.Binding) => l31.makeAppExp(l31.makePrimOp("eq?"),[l31.makeVarRef("msg"),l31.makeLitExp(makeSymbolSExp(b.var.var))]),exp.methods);    
    return l31.makeProcExp(vars,[l31.makeProcExp([l31.makeVarDecl("msg")] , [lambdaToIf(test,then)])]);
}

const rewriteAllClassExp = (exp: Exp): Exp =>
    l31.isCExp(exp) ? rewriteAllClassCExp(exp) :
    l31.isDefineExp(exp) ? l31.makeDefineExp(exp.var, rewriteAllClassCExp(exp.val)) :
    exp;

const rewriteLetExp = (exp:l31.LetExp): CExp =>{
    const body=map(rewriteAllClassCExp,exp.body);
    const vars = map((b) => b.var.var, exp.bindings);
    const vals = map((b) => rewriteAllClassCExp(b.val), exp.bindings);
    return l31.makeLetExp(zipWith(l31.makeBinding,vars,vals),map(rewriteAllClassCExp,exp.body));
}

const rewriteAllClassCExp = (exp: CExp): CExp =>
    l31.isAtomicExp(exp) ? exp :
    l31.isLitExp(exp) ? exp :
    l31.isIfExp(exp) ? l31.makeIfExp(rewriteAllClassCExp(exp.test),
                            rewriteAllClassCExp(exp.then),
                            rewriteAllClassCExp(exp.alt))  :
    l31.isAppExp(exp) ? l31.makeAppExp(rewriteAllClassCExp(exp.rator), map(rewriteAllClassCExp, exp.rands)) :
    l31.isProcExp(exp) ? l31.makeProcExp(exp.args, map(rewriteAllClassCExp, exp.body)) :
    l31.isLetExp(exp) ? rewriteLetExp(exp):
    l31.isClassExp(exp) ? rewriteAllClassCExp(class2proc(exp)) :
    exp;
    
/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>{
    if(l31.isProgram(exp)) return makeOk(l31.makeProgram(map(rewriteAllClassExp, exp.exps)));
    if(l31.isExp(exp)) return makeOk(rewriteAllClassExp(exp));
    return makeFailure("exp isn't l31 Program or Exp");
}