import { parse } from "./parser.js";
import { evaluate } from "./evaluator.js";

export const topScope = Object.create(null);

topScope.true = true;
topScope.false = false;

for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
   topScope[op] = Function("a, b", `return a ${op} b;`);
}

topScope.print = value => {
   console.log(value);
   return value;
};
   
export function run(program) {
   return evaluate(parse(program), Object.create(topScope));
}
     