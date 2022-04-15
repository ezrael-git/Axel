// literals.js

const Scanner = require("./scanner.js");

class BaseLiteral {
  /* base class */
  constructor (value,line) {
    this.type = "BaseExpression"
    this.value = value;
    this.line = line;
  }

  inspect () {
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

  inspect () {
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

  inspect () {
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

  inspect () {
    return this.value;
  }

  to_s () {
    let res = "";
    for (let e of this.elements) {
      res += e.value+"\n"
    }
    return res;
  }

  to_i () {
    let res = "";
    for (let e of this.elements) {
      res += e.value
    }
    res = parseInt(res);
    return res;
  }

  to_b () {
    return !!this.value;
  }
}

class HashLiteral {
  constructor (keys,values,line) {
    this.keys = keys;
    this.values = values;
    this.value = values;
    this.line = line;
  }

  run () {
    let c = -1;
    let obj = [];
    for (let key of this.keys) {
      c += 1;
      let val = this.values[c];
      obj[key] = val;
    }

    return obj;
  }

  inspect () {
    return this.value;
  }

  to_s () {
    let res = "";
    let obj = this.run();
    for (let k of obj) {
      let v = obj[k];
      res += k + " => " + v.to_s;
    }
    return res;
  }

  to_i () {
    let res = "";
    for (let e of this.values) {
      res += e.value
    }
    res = parseInt(res);
    return res;
  }

  to_b () {
    return !!this.value;
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

  inspect () {
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

  inspect () {
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

  inspect () {
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

  inspect () {
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

  inspect () {
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
    i.variables = v; // pass global variables
    // iterate over given args and introduce them as variables in the function scope
    for (let arg of args_given) {
      argPos += 1;
      let name = args_requested[argPos].name;
      console.log("ARG " + JSON.stringify(arg));
      let value = arg.run(v,i);
      i.variables[name] = i.toLiteral(value);
    }
    let output = i.walk(statements);
    return output;
  }

  inspect () {
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

class ArgLiteral {
  constructor (name,line) {
    this.type = "ArgExpression";
    this.name = name;
    this.value = name;
    this.line = line;
  }

  inspect () {
    return this.value;
  }

  run () {
    return this.name;
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

class VariableLiteral {
  constructor (value,mutable,line) {
    this.type = "VariableExpression"
    this.value = value;
    this.name = value;
    this.mutable = mutable;
    this.line = line;
  }

  run (v,i) {
    console.log("v: " + JSON.stringify(v));
    console.log("tryna access " + this.value);
    let res = v[this.value];
    res = Scanner.resolveRun(res,i);
    return res;
  }

  inspect () {
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

  inspect () {
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

class UnaryOperatorLiteral {
  constructor (rhs, op, line) {
    this.type = "UnaryExpression";
    this.rhs = rhs;
    this.op = op;
    this.value = op;
  }

  run (v,i) {
    i.variables = v;
    let rhs = i.resolveRun(this.rhs);
    let op = this.op;
    
    if (op == "!") {
      return !rhs;
    } else {
      throw new Error("Unknown unary operator: " + this.op);
    }
  }

  inspect () {
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

// loops

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
      } else if (o.type == "RETURN") {
        return o.output;
      }
    }
  }

  runCondition (v,i) {
    i.variables = v; // pass global variables to the ifLiteral interpreter
    let conditionResult = i.interpretNode(this.condition);

    if (["TextLiteral", "IntegerLiteral"].includes(conditionResult.constructor.name)) {
      conditionResult = conditionResult.to_b();
    }
    conditionResult = i.resolveRun(conditionResult);

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

  inspect () {
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
      } else if (o.type == "RETURN") {
        return o.output;
      }
    }
  }

  runCondition (v,i) {
    i.variables = v; // pass global variables to the ifLiteral interpreter
    let conditionResult = i.interpretNode(this.condition);

    if (["TextLiteral", "IntegerLiteral"].includes(conditionResult.constructor.name)) {
      conditionResult = conditionResult.to_b();
    }
    conditionResult = i.resolveRun(conditionResult);

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

  inspect () {
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

class ElseLiteral {
  constructor (statements,line) {
    this.type = "ElseExpression"
    this.value = statements;
    this.statements = statements;
    this.line = line;
  }

  runStatements (v,i) {
    let c = -1;
    i.variables = v;
    for (let stat of this.statements) {
      c += 1;
      let o = i.interpretNode(stat);
      if (c == this.statements.length-1) {
        return o;
      }
    }
  }


  run (v,i) {
    let o = this.runStatements(v,i);
    return o;
  }

  inspect () {
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

class ChainLiteral {
  constructor (chain,line) {
    this.type = "ChainExpression";
    this.chain = chain;
    this.value = chain;
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

  inspect () {
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

class ForLiteral {
  /*
  Nothing special, just for loops.
  Syntax:
    for (placeholder) in (iterable) do
      (statements)
    end
  */
  constructor (placeholder, iterable, statements, line) {
    this.type = "ForExpression";
    this.placeholder = placeholder;
    this.value = placeholder;
    this.iterable = iterable;
    this.statements = statements;
    this.line = line;
  }

  run (v,i) {
    i.variables = v;
    let iterable = i.resolveRun(this.iterable);
    
    let o;
    for (let itera of iterable) {
      i.variables[this.placeholder] = itera;
      for (let stat of this.statements) {
        o = i.interpretNode(stat);
        if (o.type == "RETURN") {
          return o.output;
        }
      }
    }
    
    return o;
  }

  inspect () {
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

class WhileLiteral {
  constructor (expression, statements) {
    this.type = "WhileExpression";
    this.expression = expression;
    this.value = expression;
    this.statements = statements;
  }

  runCondition (v,i) {
    let expression = this.expression;
    i.variables = v;

    if (["TextLiteral", "IntegerLiteral"].includes(expression.constructor.name)) {
      expression = expression.to_b();
    }
    expression = i.resolveRun(expression);

    return expression;
  }

  run (v,i) {
    let cycle = 0;
    let o;
    while (true) {
      i.variables = v;
      let cond = this.runCondition(v,i);
      if (cond == true) {
        for (let stat of this.statements) {
          o = i.interpretNode(stat);
          if (o.type == "RETURN") {
            return o.output;
          }
        }
        cycle += 1;
      } else {
        return o;
      }
    }
  }

  inspect () {
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

class ReturnLiteral {
  constructor (expression, line) {
    this.type = "ReturnExpression";
    this.expression = expression;
    this.value = expression;
    this.line = line;
  }

  run (v,i) {
    i.variables = v;
    let expr = i.resolveRun(this.expression);
    
    return expr;
  }

  inspect () {
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

// classes

class InstanceLiteral {
  /*
  For when an instance of a class is created.
  Syntax:
    class_name.new(arguments)
  */
  constructor (name, statements, line) {
    this.name = name;
    this.statements = statements;
    this.value = statements;
    this.line = line;

    this.methods = {};
    this.variables = {};
  }

  run (v,i) {
    /*
    Runs the statements and then filters out the instance methods and variables.
    */
    i.variables = v;
    let res = i.walk(this.statements);
    
    for (let member in res.variables) {
      let type = member.constructor.name
      if (type == "FunctionLiteral") {
        this.methods.push(member);
      } else if (type == "VariableLiteral") {
        this.variables.push(member);
      } else {
        continue;
      }
    }

    return this.methods;
  }
}

class ClassLiteral {
  /*
  For when a class is declared.
  Syntax:
    class Class_Name
      statements
    end
  */
  constructor (name, statements, line) {
    this.name = name;
    this.value = name;
    this.statements = statements;
    this.line = line;
  }

  run (v,i) {
    let methods = [];
    // fix
  }
}

class PropertyAccessLiteral {
  /*
  For when properties of an instance are accessed.
  
  Arguments:
    parent (object): the parent instance
    property (string): the property

  Syntax:
    parent.property
  */
  constructor (parent, property, line) {
    this.parent = parent;
    this.property = property;
    this.value = property;
    this.line = line;
  }

  run (v,i) {
    let parent = this.parent.run(v,i);
    let res = parent[this.property];
    return res;
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
  UnaryOperatorLiteral:UnaryOperatorLiteral,
  IfLiteral:IfLiteral,
  ElifLiteral:ElifLiteral,
  ElseLiteral:ElseLiteral,
  ChainLiteral:ChainLiteral,
  ArrayLiteral:ArrayLiteral,
  HashLiteral:HashLiteral,
  PrintLiteral:PrintLiteral,
  ArgLiteral:ArgLiteral,
  ForLiteral:ForLiteral,
  WhileLiteral:WhileLiteral,
  ReturnLiteral:ReturnLiteral
}
