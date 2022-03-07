// nodes.js



class VarAssignNode {
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
    variables[this.body.name] = this.body.line;
    return variables;
}

class VarAccessNode {
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
  constructor (lhs, rhs, op) {
    this.type = "BinaryExpression";
    this.body = {
      lhs:lhs,
      rhs:rhs,
      op:op
    }
  }

  run () {
    if (this.body.op == "+") {
      return this.body.lhs + this.body.rhs;
    } else if (this.body.op == "-") {
      return this.body.lhs - this.body.rhs;
    } else if (this.body.op == "/") {
      return this.body.lhs / this.body.rhs
    } else if (this.body.op == "*") {
      return this.body.lhs * this.body.rhs
    }
  }
}

// last change (7-3-22, 15:51)
// added run method to all node classes
