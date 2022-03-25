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
    console.log("VARACCESSNODE VARS " + JSON.stringify(variables));
    if (variables[this.body.name] == undefined) {
      console.log("VR " + JSON.stringify(variables));
      throw new Error("Cannot access unknown variable " + this.body.name);
    }
    console.log("VAN VARIABLES " + JSON.stringify(variables));
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
      throw new Error("Tried to call unknown function: " + this.body.callee);
      console.log(JSON.stringify(variables));
    }
    let statements = variables[this.body.callee][1];
    let args_requested = variables[this.body.callee][0];
    let args_given = this.body.args;
    if (args_requested.length != args_given.length) {
      throw new Error(`In line ${this.body.line}:\nMissing arg(s): ${args_given.length} were given, ${args_requested.length} were requested`)
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
    console.log("BON " + JSON.stringify(variables));
    let lhs = this.body.lhs.run(variables,walker);
    let rhs = this.body.rhs.run(variables,walker);
    console.log("L " + lhs + lhs.constructor.name);
    console.log("R " + rhs + rhs.constructor.name);
    if (this.body.op == "+") {
      return lhs + rhs
    } else if (this.body.op == "-") {
      return lhs - rhs
    } else if (this.body.op == "/") {
      return lhs / rhs
    } else if (this.body.op == "*") {
      return lhs * rhs
    } else if (this.body.op == "==") {
      console.log("COMP " + lhs === rhs);
      return lhs === rhs;
    } else if (this.body.op == "!=") {
      return lhs !== rhs
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
    console.log("PRINTNODE VALUE " + this.body.value + " & TYPE " + this.body.value.constructor.name);
    console.log("PN VARS " + JSON.stringify(variables));
    let value = this.body.value.run(variables,walker);
    console.log("PN VALUE " + JSON.stringify(value));
    if (this.body.value.constructor.name == "CallNode") {
      value = value.run(variables,walker);
    }
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
    console.log("first");
    console.log(JSON.stringify(conditionResult) + " " + conditionResult.constructor.name);
    if (conditionResult.run != undefined && !conditionResult.constructor.name.includes("Literal")) {
      conditionResult = conditionResult.run();
    }
    console.log("second")
    console.log(JSON.stringify(conditionResult) + " " + conditionResult.constructor.name);
    if (["TextLiteral", "IntegerLiteral"].includes(conditionResult.constructor.name)) {
      conditionResult = String(conditionResult.to_b());
    }
    else if (["TrueLiteral", "FalseLiteral", "NilLiteral"].includes(conditionResult.constructor.name)) {
      conditionResult = conditionResult.run();
    }
    console.log("third")
    console.log(JSON.stringify(conditionResult) + " " + conditionResult.constructor.name);
    return conditionResult; 
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
    console.log("elif first");
    console.log(JSON.stringify(conditionResult) + " " + conditionResult.constructor.name);
    if (conditionResult.run != undefined && !conditionResult.constructor.name.includes("Literal")) {
      conditionResult = conditionResult.run();
    }
    console.log("elif second")
    console.log(JSON.stringify(conditionResult) + " " + conditionResult.constructor.name);
    if (["TextLiteral", "IntegerLiteral"].includes(conditionResult.constructor.name)) {
      conditionResult = String(conditionResult.to_b());
    }
    else if (["TrueLiteral", "FalseLiteral", "NilLiteral"].includes(conditionResult.constructor.name)) {
      conditionResult = conditionResult.run();
    }
    console.log("elif third")
    console.log(JSON.stringify(conditionResult) + " " + conditionResult.constructor.name);
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
    console.log("CHAIN " + JSON.stringify(this.body.chain));
    for (let member of this.body.chain) {
      pos += 1;
      let type = member.constructor.name;
      if (type == "IfNode" || type == "ElifNode") {
        let condition = member.runCondition(v,w);
        console.log("COND " + JSON.stringify(condition));
        if (condition == "true") {
          let o = member.run(v,w);
          return o;
        }
        else {
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
  NilNode:NilNode
  
}
