// nodes.js



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
    variables[this.body.name] = this.body.line;
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
      line:line,
      start:start,
      end:end
    }
  }
  
  run (variables) {
    let value = variables[this.body.name];
    return value;
  }
}

class FuncAssignNode {
  /*
  For when a function is declared.
  */
  constructor (name, line, start, end, args, body) {
    this.type = "DeclarationExpression";
    this.body = {};
    this.body["statements"] = body;
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
  constructor (node_to_call, args, line, start, end) {
    this.type = "CallExpression";
    this.body = {
      callee:node_to_call,
      args:args,
      line:line,
      start:start,
      end:end
    }
  }
  
  run (variables,AST_walker) {
    let walker = new AST_walker();
    let statements = variables[this.body.callee];
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

class BinaryOperatorNode {
  /*
  For arithmetic operations.
  */
  constructor (lhs, rhs, op, op_type="int") {
    /*
    if op_type is int, it converts lhs and rhs to integers before the operation.
    else, it does the operation without any conversions. 
    this is to prevent things like `5+5 = 55` from happening.
    */
    this.type = "BinaryExpression";
    this.body = {
      lhs:lhs,
      rhs:rhs,
      op:op,
      op_type:op_type
    }
  }

  run () {
    let lhs = this.body.lhs
    let rhs = this.body.rhs
    if (this.body.op_type == "int") {
      lhs = parseInt(lhs);
      rhs = parseInt(rhs);
    }
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

module.exports = {
  VarAssignNode:VarAssignNode,
  VarAccessNode:VarAccessNode,
  FuncAssignNode:FuncAssignNode,
  ArgNode:ArgNode,
  CallNode:CallNode,
  TextNode:TextNode,
  IntegerNode:IntegerNode,
  BinaryOperatorNode:BinaryOperatorNode
}
