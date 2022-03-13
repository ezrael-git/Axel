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
    if (obj.constructor.name == "string") {
      return new Literal.TextLiteral(obj);
    }
    else if (obj.constructor.name.includes("Node")) {
      return obj;
    }
    else {
      return new Literal.IntegerLiteral(obj);
    }
  }

  interpretNode (node,type) {
    /*
    Interpret a single node.
    */

    if (type == "BinaryOperatorNode") {
      let result = node.run();
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

      console.log("varassignnode runned value " + JSON.stringify(value));
      value = this.toLiteral(value);
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
      console.log("PN this.variables: " + JSON.stringify(this.variables));
      let value = node.body.value.run(this.variables,new Walker());
      console.log("PN VALUE RAW " + JSON.stringify(node.body.value));
      console.log("PN VALUE UNRAW " + JSON.stringify(value))
      console.log("PN OUTPUT:");
      node.run(this.variables,new Walker());
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
    while (this.peek() != undefined) {
      let node = this.next();
      console.log("ND " + JSON.stringify(node));
      let type = this.checkType(node);
      let o = this.interpretNode(node,type);
    }
  }
}
