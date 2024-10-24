/**
 * An object to store special forms.
 * 
 * @type {Object}
 */
export const specialForms = Object.create(null);

specialForms.if = (args, scope) => {
  if (args.length != 3) {
    throw new SyntaxError("Número incorrecto de argumentos para if");
  } else if (evaluate(args[0], scope) !== false) {
    return evaluate(args[1], scope);
  } else {
    return evaluate(args[2], scope);
  }
};

specialForms.while = (args, scope) => {
    if (args.length != 2) {
        throw new SyntaxError("Número incorrecto de argumentos para while");
    }
    while (evaluate(args[0], scope) !== false) {
        evaluate(args[1], scope);
    }
}

specialForms.do = (args, scope) => {
    let valor = false;
    for (let arg of args) {
        valor = evaluate(arg, scope);
    }
    return valor;
};

specialForms.define = (args, scope) => {
    if (args.length != 2 || args[0].type != "word") {
        throw new SyntaxError("Uso incorrecto de define");
    }
    let value = evaluate(args[1], scope);
    scope[args[0].name] = value;
    return value;
};

specialForms.run = (args, scope) => {
    if (!args.length) {
        throw new SyntaxError("Las funciones necesitan un cuerpo");
    }
    let body = args[args.length - 1];
    let params = args.slice(0, args.length - 1).map(expr => {
        if (expr.type != "word") {
            throw new SyntaxError("Los nombres de los parámetros deben ser palabras");
        }
        return expr.name;
    });
    return function(...args) {
        if (args.length != params.length) {
            throw new TypeError("Número incorrecto de argumentos");
        }
        let localScope = Object.create(scope);
        for (let i = 0; i < args.length; i++) {
            localScope[params[i]] = args[i];
        }
        return evaluate(body, localScope);
    };
};

specialForms.fun = (args, scope) => {
    if (!args.length) {
        throw new SyntaxError("Las funciones necesitan un cuerpo");
    }
    let body = args[args.length - 1];
    let params = args.slice(0, args.length - 1).map(expr => {
        if (expr.type != "word") {
            throw new SyntaxError("Los nombres de los parámetros deben ser palabras");
        }
        return expr.name;
    });
    return function(...args) {
        if (args.length != params.length) {
            throw new TypeError("Número incorrecto de argumentos");
        }
        let localScope = Object.create(scope);
        for (let i = 0; i < args.length; i++) {
            localScope[params[i]] = args[i];
        }
        return evaluate(body, localScope);
    };
};
    
    
export function evaluate(expr, scope) {
    if (expr.type == "value") {
        return expr.value;
    } else if (expr.type == "word") {
        if (expr.name in scope) {
            return scope[expr.name];
        } else {
            throw new ReferenceError(`Vinculación indefinida: ${expr.name}`);
        }
    } else if (expr.type == "apply") {
        let {operator, args} = expr;
        if (operator.type == "word" && operator.name in specialForms) {
            return specialForms[operator.name](expr.args, scope);
        } else {
            let op = evaluate(operator, scope);
            if (typeof op == "function") {
                return op(...args.map(arg => evaluate(arg, scope)));
            } else {
                throw new TypeError("Aplicando una no-función.");
            }
        }
    }
}