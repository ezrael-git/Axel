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
      console.log("VR " + JSON.stringify(variables));
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
      throw new Error("Tried to call unknown function: " + this.body.callee);
      console.log(JSON.stringify(variables));
    }
    let statement = variables[this.body.callee][1][0];
    let args_requested = variables[this.body.callee][0];
    let args_given = this.body.args;
    if (args_requested.length != args_given.length) {
      throw new Error(`In line ${this.body.line}:\nMissing arg(s): ${args_given.length} were given, ${args_requested.length} were requested`)
    }

    let argPos = -1;
    for (let arg of args_given) {
      argPos += 1;
      console.log("ARG TYPE " + arg.constructor.name);
      let name = args_requested[argPos].body.name;
      console.log("ARG Name " + name);
      let value = arg.run(variables,walker);
      walker.variables[name] = value;
    }
    console.log("CALLNODE VARIABLES " + JSON.stringify(variables));
    let output = walker.interpretNode(statement,walker.checkType(statement));
    console.log("CALLNODE OUTPUT " + output);
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
    console.log("PRINTNODE VALUE " + this.body.value + " & TYPE " + this.body.value.constructor.name);
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
