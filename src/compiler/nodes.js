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
}

class FuncAssignNode {
  constructor (name, line, start, end, args, body) {
    this.type = "DeclarationExpression";
    this.body = body;
    this.body["args"] = args;
    this.body["start"] = start;
    this.body["end"] = end;
    this.body["line"] = line;
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

  toString () {
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

  toString () {
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


