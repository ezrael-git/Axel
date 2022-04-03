// nodes.js
const Scanner = require("./scanner.js");



class VarAssignNode {
  /*
  Node for when a variable is declared, or assigned to.
  */
  constructor (name, mutable, value_type, value, line, start, end) {
    this.type = "DeclarationExpression";
    this.body = {
      name:name,
      mutable:mutable,
      line:line,
      start:start,
      end:end,
      value_type:value_type,
      value:value
    }
  }
  
  run (variables) {
    /* 
    Takes in an Object containing the variables for the program and returns an edited version of it containing the information of the variable.
    */
    variables[this.body.name] = this.body.value;
    return variables;
  }
}

class VarAccessNode {
  /*
  For when a variable is accessed.
  */
  constructor (name, line, start, end) {
    this.type = "AccessExpression"
    this.body = {
      name:name,
      line:line,
      start:start,
      end:end
    }
  }
  
  run (variables,walker) {
    if (variables[this.body.name] == undefined) {
      throw new Error("Cannot access unknown variable " + this.body.name);
    }
    let value = variables[this.body.name].run(variables,walker);
    return value;
  }
}

class FuncAssignNode {
  /*
  For when a function is declared.
  */
  constructor (name, line, start, end, args, statements) {
    this.type = "DeclarationExpression";
    this.body = {};
    this.body["statements"] = statements;
    this.body["name"] = name;
    this.body["args"] = args;
    this.body["start"] = start;
    this.body["end"] = end;
    this.body["line"] = line;
  }
  
  run (variables) {
    variables[this.body.name] = this.body.statements;
    return variables;
  }
}

class ArgNode {
  /*
  Node containing an individual argument in a function's parameters.
  Note that this node mustn't be used for function calls.
  */
  constructor (name, line, start, end) {
    this.type = "FunctionArgument";
    this.body = {
      name:name,
      line:line,
      start:start,
      end:end
    }
  }
  
  run () {
    return this.body.name;
  }
}

class CallNode {
  /*
  For when a function is called.
  */
  constructor (func_to_call, args, line, start, end) {
    this.type = "CallExpression";
    this.body = {
      callee:func_to_call,
      args:args,
      line:line,
      start:start,
      end:end
    }
  }

  
  run (variables,walker) {
    if (variables[this.body.callee] == undefined) {
      throw new Error(`At line ${this.body.line}:\nTried to call unknown function: ${this.body.callee}`);
    }
    let func = variables[this.body.callee];
    if (func.constructor.name != "FunctionLiteral") {
      throw new Error(`At line ${this.body.line}:\nParseError: Tried to call a ${func.constructor.name}, whereas a FunctionLiteral was expected`);
    }

    let statements = func.body;
    let args_requested = func.args;
    let args_given = this.body.args;
    let combo = args_requested - args_given;
    if (combo > 0) {
      throw new Error(`At line ${this.body.line}:\nArgumentError: Missing args (${combo})`);
    } else if (combo < 0) {
      throw new Error(`At line ${this.body.line}:\nArgumentError: Too many args were given (expected ${args_requested}, got ${args_given}`);
    }

    let argPos = -1;
    let scanner = new Scanner();
    // iterate over given args and introduce them as variables in the function scope
    for (let arg of args_given) {
      argPos += 1;
      let name = args_requested[argPos].body.name;
      let value = arg.run(variables,walker);
      walker.variables[name] = scanner.toLiteral(value);
    }
    let output = walker.walk(statements);
    return output;
  }
}

class TextNode {
  /*
  For when a String object is detected.
  */
  constructor (value, line, start, end) {
    this.type = "TextExpression";
    this.body = {
      value:value,
      line:line,
      start:start,
      end:end
    }
  }

  run () {
    return this.body.value;
  }
}

class IntegerNode {
  /*
  For when an Integer object is detected.
  */
  constructor (value, line, start, end) {
    this.type = "IntegerExpression";
    this.body = {
      value:value,
      line:line,
      start:start,
      end:end
    }
  }

  run () {
    return parseInt(this.body.value);
  }
}

class UnaryOperatorNode {
  constructor (op, rhs) {
    this.type = "UnaryExpression";
    this.body = {
      op:op,
      rhs:rhs
    }
  }

  run (v,w) {
    let rhs = this.body.rhs.run(v,w);
    let op = this.body.op;
    if (op == "!") {
      return !rhs
    }
  }
}

class BinaryOperatorNode {
  /*
  For arithmetic operations.
  */
  constructor (lhs, rhs, op) {
    this.type = "BinaryExpression";
    this.body = {
      lhs:lhs,
      rhs:rhs,
      op:op
    }
  }

  run (variables,walker) {
    let lhs = this.body.lhs.run(variables,walker);
    let rhs = this.body.rhs.run(variables,walker);
    if (lhs.constructor.name != rhs.constructor.name) {
      throw new Error(`At line ${this.body.lhs.line}:\nCannot perform ${this.opToS()} on a ${lhs.constructor.name} and ${rhs.constructor.name}`);
    }
    if (this.body.op == "+") {
      return lhs + rhs
    } else if (this.body.op == "-") {
      return lhs - rhs
    } else if (this.body.op == "/") {
      return lhs / rhs
    } else if (this.body.op == "*") {
      return lhs * rhs
    } else if (this.body.op == "==") {
      return lhs === rhs;
    } else if (this.body.op == "!=") {
      return lhs !== rhs
    } else if (this.body.op == ">") {
      return lhs > rhs
    } else if (this.body.op == "<") {
      return lhs < rhs
    } else {
      throw new Error("Unknown binary operator: " + this.body.op);
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


class PrintNode {
  constructor (value, line, start, end) {
    this.type = "PrintExpression"
    this.body = {
      value:value,
      line:line,
      start:start,
      end:end
    }
  }

  run (variables,walker) {
    let scanner = new Scanner();
    let value = this.body.value.run(variables,walker);
    if (this.body.value.constructor.name == "CallNode") {
      value = value.run(variables,walker);
    }
    // -- new start
    console.log("before rr " + JSON.stringify(value));
    value = scanner.resolveRun(value);
    console.log("after rr " + JSON.stringify(value));
    // -- new end
    console.log(value);
    return scanner.toLiteral(value);
  }
}

class IfNode {
  constructor (condition, statements, line, start, end) {
    this.type = "IfExpression";
    this.body = {
      condition:condition,
      statements:statements,
      line:line,
      start:start,
      end:end
    }
  }

  runStatements (v,w) {
    let c = -1;
    for (let stat of this.body.statements) {
      c += 1;
      let o = stat.run(v,w);
      if (c == this.body.statements.length-1) {
        return o;
      }
    }
  }

  runCondition (v,w) {
    w.variables = v; // pass global variables to the ifNode interpreter
    let conditionResult = w.interpretNode(this.body.condition,this.body.condition.constructor.name);
    if (conditionResult.run != undefined && !conditionResult.constructor.name.includes("Literal")) {
      conditionResult = conditionResult.run();
    }

    if (["TextLiteral", "IntegerLiteral"].includes(conditionResult.constructor.name)) {
      conditionResult = String(conditionResult.to_b());
    }

    if (["TrueLiteral", "FalseLiteral", "NilLiteral"].includes(conditionResult.constructor.name)) {
      conditionResult = conditionResult.run();
    }

    return conditionResult
  }

  run (v,w) {
    let conditionResult = this.runCondition(v,w);
    if (conditionResult == "true") {
      let o = this.runStatements(v,w);
      return o;
    } else {
      return false;
    }
  }
}

class ElifNode {
  constructor (condition, statements, line, start, end) {
    this.type = "ElifExpression";
    this.body = {
      condition:condition,
      statements:statements,
      line:line,
      start:start,
      end:end
    }
  }

  runStatements (v,w) {
    let c = -1;
    for (let stat of this.body.statements) {
      c += 1;
      let o = stat.run(v,w);
      if (c == this.body.statements.length-1) {
        return o;
      }
    }
  }

  runCondition (v,w) {
    w.variables = v; // pass global variables to the ifNode interpreter
    let conditionResult = w.interpretNode(this.body.condition,this.body.condition.constructor.name);
    if (conditionResult.run != undefined && !conditionResult.constructor.name.includes("Literal")) {
      conditionResult = conditionResult.run();
    }

    if (["TextLiteral", "IntegerLiteral"].includes(conditionResult.constructor.name)) {
      conditionResult = String(conditionResult.to_b());
    }

    else if (["TrueLiteral", "FalseLiteral", "NilLiteral"].includes(conditionResult.constructor.name)) {
      conditionResult = conditionResult.run();
    }
    return conditionResult; 
  }

  run (v,w) {
    let o = this.runStatements(v,w);
    return o;
  }
}

class ElseNode {
  constructor (statements, line, start, end) {
    this.type = "ElseExpression";
    this.body = {
      statements:statements,
      line:line,
      start:start,
      end:end
    }
  }

  runStatements (v,w) {
    let c = -1;
    for (let stat of this.body.statements) {
      c += 1;
      let o = stat.run(v,w);
      if (c == this.body.statements.length-1) {
        return o;
      }
    }
  }


  run (v,w) {
    let o = this.runStatements(v,w);
    return o;
  }
}

class IfChainNode {
  constructor (chain,line,start,end) {
    this.type = "IfChainExpression";
    this.body = {
      chain:chain,
      line:line,
      start:start,
      end:end
    }
  }

  run (v,w) {
    let pos = -1;
    if (this.body.chain[0].type != "IfExpression") {
      throw new Error("IfChain's first member should be an IfExpression, not " + JSON.stringify(this.body.chain[0]));
    }
    let conditions = [];
    for (let member of this.body.chain) {
      pos += 1;
      let type = member.constructor.name;
      if (type == "IfNode" || type == "ElifNode") {
        let condition = member.runCondition(v,w);
        console.log("COND " + condition);
        console.log("MEM " + member.constructor.name);
        if (condition == "true") {
          let o = member.run(v,w);
          console.log("O " + o);
          return o;
        }
        else {
          conditions.push(condition);
          continue;
        }
      }
      else if (type == "ElseNode") {
        let o = member.run(v,w);
        return o;
      }
      else {
        throw new Error("Unknown type in ifNodeChain: " + type);
      }
    }
    return conditions[conditions.length - 1];
  }
}


class TrueNode {
  constructor (line,start,end) {
    this.type = "BooleanExpression";
    this.body = {
      value:"true",
      line:line,
      start:start,
      end:end
    }
  }

  run (v,w) {
    return this.body.value;
  }
}

class FalseNode {
  constructor (line,start,end) {
    this.type = "BooleanExpression";
    this.body = {
      value:"false",
      line:line,
      start:start,
      end:end
    }
  }

  run (v,w) {
    return this.body.value;
  }
}

class NilNode {
  constructor (line,start,end) {
    this.type = "BooleanExpression";
    this.body = {
      value:"nil",
      line:line,
      start:start,
      end:end
    }
  }

  run (v,w) {
    return this.body.value;
  }
}

class ReturnNode {
  constructor (value, line, start, end) {
    this.type = "ReturnExpression";
    this.body = {
      value:value,
      line:line,
      start:start,
      end:end
    }
  }

  run (v,w) {
    w.variables = v;
    let res = w.interpretNode(this.body.value,this.body.value.constructor.name);
    return res;
  }
}

module.exports = {
  VarAssignNode:VarAssignNode,
  VarAccessNode:VarAccessNode,
  FuncAssignNode:FuncAssignNode,
  ArgNode:ArgNode,
  CallNode:CallNode,
  TextNode:TextNode,
  IntegerNode:IntegerNode,
  UnaryOperatorNode:UnaryOperatorNode,
  BinaryOperatorNode:BinaryOperatorNode,
  PrintNode:PrintNode,
  IfNode:IfNode,
  ElifNode:ElifNode,
  ElseNode:ElseNode,
  IfChainNode:IfChainNode,
  TrueNode:TrueNode,
  FalseNode:FalseNode,
  NilNode:NilNode,
  ReturnNode:ReturnNode
  
}
