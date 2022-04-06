// literals.js

class BaseLiteral {
  /* base class */
  constructor (value,line) {
    this.value = value;
    this.line = line;
  }

  to_s () {
    return String(this.value);
  }

  to_i () {
    return parseInt(this.value);
  }

  to_b () {
    return !!this.value;
  }
}

class StringLiteral {
  constructor (value,line) {
    this.value = value;
    this.line = line;
  }

  run () {
    return this.value;
  }

  to_s () {
    return String(this.value);
  }

  to_i () {
    return parseInt(this.value);
  }

  to_b () {
    return !!this.value;
  }
}

class IntegerLiteral {
  constructor (value,line) {
    this.value = value;
    this.line = line;
  }

  run () {
    return this.value;
  }

  to_s () {
    return String(this.value);
  }

  to_i () {
    return parseInt(this.value);
  }

  to_b () {
    return !!this.value;
  }
}

class TrueLiteral {
  constructor (line) {
    this.value = true;
    this.line = line;
  }

  run () {
    return this.value;
  }

  to_s () {
    return String(this.value);
  }

  to_i () {
    return parseInt(this.value);
  }

  to_b () {
    return !!this.value;
  }
}
class FalseLiteral {
  constructor (line) {
    this.value = false;
    this.line = line;
  }

  run () {
    return this.value;
  }

  to_s () {
    return String(this.value);
  }

  to_i () {
    return parseInt(this.value);
  }

  to_b () {
    return !!this.value;
  }
}

class NilLiteral {
  constructor (line) {
    this.value = nil;
    this.line = line;
  }

  run () {
    return this.value;
  }

  to_s () {
    return String(this.value);
  }

  to_i () {
    return parseInt(this.value);
  }

  to_b () {
    return !!this.value;
  }
}

class FunctionLiteral {
  constructor (name, args, statements,line) {
    this.value = this.name;
    this.args = args;
    this.statements = statements;
    this.line = line;
  }

  run (v,w) {
    return this.name;
  }

  to_s () {
    return this.name;
  }

  to_i () {
    return parseInt(this.value);
  }

  to_b () {
    return !!this.value;
  }
}

class CallLiteral {
  constructor (value, args, line) {
    this.value = value;
    this.line = line;
    this.args = args;
  }

  run (v,i) {
    if (variables[this.body.callee] == undefined) {
      throw new Error(`At line ${this.line}:\nTried to call unknown function: ${this.body.callee}`);
    }
    let func = variables[this.body.callee];
    if (func.constructor.name != "FunctionLiteral") {
      throw new Error(`At line ${this.line}:\nParseError: Tried to call a ${func.constructor.name}, whereas a FunctionLiteral was expected`);
    }

    let statements = func.statements;
    let args_requested = func.args;
    let args_given = this.args;
    let combo = args_requested - args_given;
    if (combo > 0) {
      throw new Error(`At line ${this.line}:\nArgumentError: Missing args (${combo})`);
    } else if (combo < 0) {
      throw new Error(`At line ${this.line}:\nArgumentError: Too many args were given (expected ${args_requested}, got ${args_given}`);
    }

    let argPos = -1;
    let scanner = new Scanner();
    // iterate over given args and introduce them as variables in the function scope
    for (let arg of args_given) {
      argPos += 1;
      let name = args_requested[argPos].name;
      let value = arg.run(variables,walker);
      i.variables[name] = scanner.toLiteral(value);
    }
    let output = i.walk(statements);
    return output;
  }

  to_s () {
    return this.value;
  }

  to_i () {
    return parseInt(this.value);
  }

  to_b () {
    return !!this.value;
  }
}

class VariableLiteral {
  constructor (value,mutable,line) {
    this.value = value;
    this.mutable = mutable;
    this.line = line;
  }

  run (v,i) {
    let res = v[this.value];
    res = this.scanner.resolveRun(res);
    return res;
  }

  to_s () {
    return this.value;
  }

  to_i () {
    return parseInt(this.value);
  }

  to_b () {
    return !!this.value;
  }
}

class VarDecLiteral {
  constructor (name,value,mutable,line) {
    this.name = name;
    this.value = value;
    this.mutable = mutable;
    this.line = line;
  }

  run () {
    return null;
  }
}

class BinaryOperatorLiteral {
  constructor (lhs, rhs, op) {
    this.value = op;
    this.op = op;
    this.lhs = lhs;
    this.rhs = rhs;
  }

  run (v,i) {
    let lhs = this.body.lhs.run(v,i);
    let rhs = this.body.rhs.run(v,i);
    let op = this.op;
    if (lhs.constructor.name != rhs.constructor.name) {
      throw new Error(`At line ${this.lhs.line}:\nCannot perform ${this.opToS()} on a ${lhs.constructor.name} and ${rhs.constructor.name}`);
    }
    if (op == "+") {
      return lhs + rhs
    } else if (op == "-") {
      return lhs - rhs
    } else if (op == "/") {
      return lhs / rhs
    } else if (op == "*") {
      return lhs * rhs
    } else if (op == "==") {
      return lhs === rhs;
    } else if (op == "!=") {
      return lhs !== rhs
    } else if (op == ">") {
      return lhs > rhs
    } else if (op == "<") {
      return lhs < rhs
    } else {
      throw new Error("Unknown binary operator: " + this.op);
    }
  }

  opToS () {
    switch (this.body.op) {
      case "+":
        return "ADDITION";
        break
      case "-":
        return "SUBTRACTION";
        break;
      case "*":
        return "MULTIPLICATION";
        break;
      case "/":
        return "DIVISION";
        break;
      case "==":
        return "COMPARISON";
        break;
      case "!=":
        return "COMPARISON";
    }
  }
}




module.exports = {
  TextLiteral:TextLiteral,
  IntegerLiteral:IntegerLiteral,
  TrueLiteral:TrueLiteral,
  FalseLiteral:FalseLiteral,
  NilLiteral:NilLiteral,
  FunctionLiteral:FunctionLiteral,
  CallLiteral:CallLiteral,
  VariableLiteral:VariableLiteral,
  VarDecLiteral:VarDecLiteral,
  BinaryOperatorLiteral:BinaryOperatorLiteral
}
