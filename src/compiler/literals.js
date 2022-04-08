// literals.js

const Scanner = require("./scanner.js");

class BaseLiteral {
  /* base class */
  constructor (value,line) {
    this.type = "BaseExpression"
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
// data types

class StringLiteral {
  constructor (value,line) {
    this.type = "StringExpression"
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
    this.type = "IntegerExpression"
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

class ArrayLiteral {
  constructor (elements,line) {
    this.type = "ArrayExpression"
    this.value = elements;
    this.elements = elements;
    this.line = line;
  }

  run () {
    return this.elements;
  }
}


class TrueLiteral {
  constructor (line) {
    this.type = "BooleanExpression"
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
    this.type = "BooleanExpression"
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
    this.type = "BooleanExpression"
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

// keywords

class PrintLiteral {
  constructor (value,line) {
    this.type = "PrintExpression"
    this.value = value;
    this.line = line;
  }

  run (v,i) {
    let value = this.value.run(v,i);
    value = Scanner.resolveRun(value,i);
    console.log(value);
    return value;
  }
}

// objects

class FunctionLiteral {
  constructor (name, args, statements,line) {
    this.type = "FunctionExpression"
    this.value = name
    this.args = args;
    this.statements = statements;
    this.line = line;
  }

  run (v,w) {
    return this.value;
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

class CallLiteral {
  constructor (value, args, line) {
    this.type = "CallExpression"
    this.value = value;
    this.line = line;
    this.args = args;
  }

  run (v,i) {
    if (v[this.value] == undefined) {
      throw new Error(`At line ${this.line}:\nTried to call unknown function: ${this.value}`);
    }
    let func = v[this.value];
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
      let value = arg.run(v,i);
      i.variables[name] = i.toLiteral(value);
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
    this.type = "VariableExpression"
    this.value = value;
    this.name = value;
    this.mutable = mutable;
    this.line = line;
  }

  run (v,i) {
    let res = v[this.value];
    res = Scanner.resolveRun(res,i);
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

class BinaryOperatorLiteral {
  constructor (lhs, rhs, op, line) {
    this.type = "BinaryExpression"
    this.value = op;
    this.op = op;
    this.lhs = lhs;
    this.rhs = rhs;
    this.line = line;
  }

  run (v,i) {
    let lhs = this.lhs.run(v,i);
    let rhs = this.rhs.run(v,i);
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

// ifs

class IfLiteral {
  constructor (condition,statements,line) {
    this.type = "IfExpression"
    this.value = condition;
    this.condition = condition;
    this.statements = statements;
    this.line = line;
  }

  runStatements (v,i) {
    let c = -1;
    i.variables = v; // pass global variables
    for (let stat of this.statements) {
      c += 1;
      let o = i.interpretNode(stat);
      if (c == this.statements.length-1) {
        return o;
      }
    }
  }

  runCondition (v,i) {
    i.variables = v; // pass global variables to the ifLiteral interpreter
    let conditionResult = i.interpretNode(this.condition);
    conditionResult = i.resolveRun(conditionResult);

    if (["TextLiteral", "IntegerLiteral"].includes(conditionResult.constructor.name)) {
      conditionResult = conditionResult.to_b();
    }

    return conditionResult;
  }

  run (v,i) {
    let conditionResult = this.runCondition(v,i);
    if (conditionResult == true) {
      let o = this.runStatements(v,i);
      return o;
    } else {
      return false;
    }
  }

}

class ElifLiteral {
  constructor (condition,statements,line) {
    this.type = "ElifExpression"
    this.value = condition;
    this.condition = condition;
    this.statements = statements;
    this.line = line;
  }

  runStatements (v,i) {
    let c = -1;
    i.variables = v; // pass global variables
    for (let stat of this.statements) {
      c += 1;
      let o = i.interpretNode(stat);
      if (c == this.statements.length-1) {
        return o;
      }
    }
  }

  runCondition (v,i) {
    i.variables = v; // pass global variables to the ifLiteral interpreter
    let conditionResult = i.interpretNode(this.condition);
    conditionResult = i.resolveRun(conditionResult);

    if (["TextLiteral", "IntegerLiteral"].includes(conditionResult.constructor.name)) {
      conditionResult = conditionResult.to_b();
    }

    return conditionResult;
  }

  run (v,i) {
    let conditionResult = this.runCondition(v,i);
    if (conditionResult == true) {
      let o = this.runStatements(v,i);
      return o;
    } else {
      return false;
    }
  }

}

class ElseLiteral {
  constructor (statements,line) {
    this.type = "ElseExpression"
    this.value = statements;
    this.statements = statements;
    this.line = line;
  }

  runStatements (v,i) {
    let c = -1;
    for (let stat of this.statements) {
      c += 1;
      let o = stat.run(v,i);
      if (c == this.statements.length-1) {
        return o;
      }
    }
  }


  run (v,i) {
    let o = this.runStatements(v,i);
    return o;
  }
}

class ChainLiteral {
  constructor (chain,line) {
    this.type = "ChainExpression";
    this.chain = chain;
    this.line = line;
  }

  run (v,i) {
    let pos = -1;
    if (this.chain[0].type != "IfExpression") {
      throw new Error("IfChain's first member should be an IfExpression, not " + JSON.stringify(this.chain[0]));
    }
    let conditions = [];
    for (let member of this.chain) {
      pos += 1;
      let type = member.constructor.name;
      if (type == "IfLiteral" || type == "ElifLiteral") {
        let condition = member.runCondition(v,i);
        if (condition == true) {
          let o = member.run(v,i);
          console.log("O " + o);
          return o;
        }
        else {
          conditions.push(condition);
          continue;
        }
      }
      else if (type == "ElseLiteral") {
        let o = member.run(v,i);
        return o;
      }
      else {
        throw new Error("Unknown type in ifNodeChain: " + type);
      }
    }
    return conditions[conditions.length - 1];
  }
}

class ArgLiteral {
  constructor (name,line) {
    this.type = "ArgExpression";
    this.name = name;
    this.line = line;
  }

  run () {
    return this.name;
  }
}





module.exports = {
  StringLiteral:StringLiteral,
  IntegerLiteral:IntegerLiteral,
  TrueLiteral:TrueLiteral,
  FalseLiteral:FalseLiteral,
  NilLiteral:NilLiteral,
  FunctionLiteral:FunctionLiteral,
  CallLiteral:CallLiteral,
  VariableLiteral:VariableLiteral,
  BinaryOperatorLiteral:BinaryOperatorLiteral,
  IfLiteral:IfLiteral,
  ElifLiteral:ElifLiteral,
  ElseLiteral:ElseLiteral,
  ChainLiteral:ChainLiteral,
  ArrayLiteral:ArrayLiteral,
  PrintLiteral:PrintLiteral,
  ArgLiteral:ArgLiteral
}
