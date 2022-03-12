// nodes.js

class Literal {
  /* base class */
  constructor (value) {
    this.value = value;
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
    if (this.variables[this.body.name] == undefined) {
      throw new Error("Cannot access unknown variable " + this.body.name);
    }
    let value = walker.walk(variables[this.body.name]);
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
    return this.body.value;
  }
}

class HandSideNode {
  /*
  For the BinaryOperatorNode
  */
  constructor (data, side) {
    this.type = "HandSideNode"
    this.body = {
      data:data,
      side:side
    }
  }

  run (variables,walker) {
    let output = walker.walk(this.body.data);
    return output;
  }
}

class BinaryOperatorNode {
  /*
  For arithmetic operations on integers.
  */
  constructor (lhs, rhs, op) {
    this.type = "BinaryExpression";
    if (lhs.constructor.name != "HandSideNode" || rhs.constructor.name != "HandSideNode") {
      throw new Error("BinaryOperatorNode lhs and rhs arguments must be a HandSideNode");
    }
    this.body = {
      lhs:lhs,
      rhs:rhs,
      op:op
    }
  }

  run (variables,walker) {
    let lhs = this.body.lhs.run(variables,walker);
    let rhs = this.body.rhs.run(variables,walker);
    if (this.body.op == "+") {
      return lhs + rhs
    } else if (this.body.op == "-") {
      return lhs - rhs
    } else if (this.body.op == "/") {
      return lhs / rhs
    } else if (this.body.op == "*") {
      return lhs * rhs
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
    console.log(this.body.value.run(variables,walker));
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
  HandSideNode:HandSideNode,
  BinaryOperatorNode:BinaryOperatorNode,
  PrintNode:PrintNode
}
