// walker.js
// interpret nodes and ASTs

const Literal = require("./literals.js");


module.exports = class Walker {
  constructor () {
    this.program = [];
    this.node = -1;
    this.variables = {};
  }
  
  next () {
    this.node += 1;
    return this.program[this.node];
  }
  
  previous () {
    this.node -= 1;
    return this.program[this.node];
  }
  
  current () {
    return this.program[this.node];
  }
  
  peek (nodes=1) {
    return this.program[this.node+nodes];
  }
  
  lookBack (nodes=1) {
    return this.program[this.node-nodes];
  }
  
  checkType (obj) {
    return obj.constructor.name;
  }

  toLiteral (obj) {
    if (obj.constructor.name == "String" && !["true","false","nil"].includes(obj)) {
      return new Literal.TextLiteral(obj);
    }
    else if (obj.constructor.name == "Number") {
      return new Literal.IntegerLiteral(obj);
    }
    else if (String(obj) == "true") {
      return new Literal.TrueLiteral(obj);
    }
    else if (String(obj) == "false") {
      return new Literal.FalseLiteral(obj);
    }
    else if (String(obj) == "nil") {
      return new Literal.NilLiteral(obj);
    }
    else if (["Node", "Literal"].includes(obj.constructor.name)) {
      return obj;
    }
    else {
      return obj;
    }
  }

  resolveRun (obj,interpretNode) {
    while (obj.run != undefined) {
      obj = interpretNode(obj);
    }
    return obj;
  }

  interpretNode (node,type) {
    /*
    Interpret a single node.
    */

    if (type == "BinaryOperatorNode") {
      let result = this.toLiteral(node.run(this.variables,new Walker()));
      return result;
    }
    else if (type == "FuncAssignNode") {
      let name = node.body.name;
      let stats = node.body.statements;
      let args = node.body.args;
      this.variables[name] = [args,stats];
      return new Literal.TextLiteral(name);
    }
    else if (type == "CallNode") {
      let o = node.run(this.variables,new Walker());
      return this.toLiteral(o);
    }
    else if (type == "VarAssignNode") {
      let name = node.body.name;
      console.log("varassignnode type " + node.body.value.constructor.name);
      let value = node.body.value.run(this.variables,new Walker());

      console.log("varassignnode runned value " + JSON.stringify(value) + "and type " + value.constructor.name);
      value = this.toLiteral(value);
      console.log("after toliteral value " + JSON.stringify(value));
      let mutable = node.body.mutable;
      if (this.variables[name] == undefined) {
        this.variables[name] = value;
        console.log("added " + name + " to this.variables");
        return value;
      } else if (mutable == true) {
        this.variables[name] = value;
        return value;
      } else {
        throw new Error("Cannot change a constant variable");
      }
    }
    else if (type == "VarAccessNode") {
      let name = node.body.name;
      if (this.variables[name] != undefined) {
        return this.variables[name];
      } else {
        throw new Error("Cannot access unknown variable " + name)
      }
    }
    else if (type == "TextNode" || type == "IntegerNode") {
      return this.toLiteral(node.run());
    }
    else if (type == "PrintNode") {
      let value = node.run(this.variables,new Walker())
      return value;
    }
    else if (["TrueNode","FalseNode","NilNode"].includes(type)) {
      return this.toLiteral(node.run());
    }
    else if (type == "IfChainNode") {
      let o = node.run(this.variables,new Walker());
      return this.toLiteral(o);
    }
    else if (type == "ReturnNode") {
      let value = node.run(this.variables,new Walker());
      return value;
    }
    // literals
    else if (node.constructor.name.includes("Literal")) {
      return node.run();
    }
    else {
      throw new Error(`Unknown Node: ${JSON.stringify(node)} \nWith type: ${type}`);
    }
  }
  
  
  
  walk (ast, wrapped=false) {
    /*
    Interpret a whole AST. Basically this.interpretNode in a while loop.
    */
    if (wrapped == true) {
      let program = ast["Program"];
      this.program = program;
    } else {
      this.program = ast;
    }
    console.log("PG " + JSON.stringify(this.program));
    let iterated = -1;
    let outputs = [];
    while (this.peek() != undefined) {
      iterated += 1;
      let node = this.next();
      console.log("ND " + JSON.stringify(node));
      let type = this.checkType(node);
      let o = this.interpretNode(node,type);
      outputs.push(o);
    }
    // return last expression's result
    return outputs[outputs.length - 1];
  }
}
