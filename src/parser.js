
import { skipSpace } from './utils.js';

/**
 * Parses a given program string and returns the expression tree.
 *
 * @param {string} program - The program string to parse.
 * @returns {Object} The parsed expression tree.
 * @throws {SyntaxError} If there is unexpected text after the program.
 */
export function parse(program) {
    let {expr, rest} = parseExpression(program);
    if (skipSpace(rest).length > 0) {
      throw new SyntaxError("Texto inesperado después del programa");
    }
    return expr;
  }

/**
 * Parses a given program string and returns an expression object.
 *
 * @param {string} program - The program string to parse.
 * @returns {Object} An expression object representing the parsed expression.
 * @throws {SyntaxError} If the program contains unexpected syntax.
 */
export function parseExpression(program) {
  program = skipSpace(program);
  let match, expr;
  if (match = /^"([^"]*)"/.exec(program)) {
    expr = {type: "value", value: match[1]};
  } else if (match = /^\d+\b/.exec(program)) {
    expr = {type: "value", value: Number(match[0])};
  } else if (match = /^[^\s(),#"]+/.exec(program)) {
    expr = {type: "word", name: match[0]};
  } else {
    throw new SyntaxError("Sintaxis inesperada: " + program);
  }

  return parseApply(expr, program.slice(match[0].length));
}


/**
 * Parses an application expression from the given program string.
 *
 * @param {Object} expr - The expression object to apply.
 * @param {string} program - The remaining program string to parse.
 * @returns {Object} An object containing the parsed expression and the rest of the program string.
 * @throws {SyntaxError} If the program string contains unexpected characters.
 */
export function parseApply(expr, program) {
    program = skipSpace(program);
    if (program[0] != "(") {
      return {expr: expr, rest: program};
    }
  
    program = skipSpace(program.slice(1));
    expr = {type: "apply", operator: expr, args: []};
    while (program[0] != ")") {
      let arg = parseExpression(program);
      expr.args.push(arg.expr);
      program = skipSpace(arg.rest);
      if (program[0] == ",") {
        program = skipSpace(program.slice(1));
      } else if (program[0] != ")") {
        throw new SyntaxError("Se esperaba ',' o ')'");
      }
    }
    return parseApply(expr, program.slice(1));
  }