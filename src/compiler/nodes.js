// nodes.js



class VarAssignNode {
  constructor (name_node, value_node, line_node) {
    this.type = "declaration";
    this.name_node = name_node;
    this.value_node = value_node;
    this.line_node = line_node;
  }
}

class FuncAssignNode {
  constructor (name_node, arg_node, body_node, auto_return_node, line_node) {
    this.type = "declaration";
    this.name_node = name_node;
    this.arg_node = arg_node;
    this.body_node = body_node;
    this.auto_return_node = auto_return_node;
    this.line_node = line_node;
  }
}

class TextNode {
  constructor (value_node, line_node) {
    this.type = "text";
    this.value_node = value_node;
    this.line_node = line_node;
  }

  toString () {
    return this.value_node;
  }
}

class IntegerNode {
  constructor (value_node, line_node) {
    this.type = "integer";
    this.value_node = value_node;
    this.line_node = line_node;
  }

  toString () {
    return this.value_node;
  }
}

class CallNode {
  constructor (node, arg_nodes, line_node) {
    this.node_to_call = node;
    this.arg_nodes = arg_nodes;
    this.line_node = line_node;
  }
}
