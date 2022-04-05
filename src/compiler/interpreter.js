// interpreter.js
// interpret nodes and ASTs

const Literal = require("./literals.js");


module.exports = class Interpreter {
  constructor () {
    this.program = [];
    this.node = -1;
    this.variables = {};
  }
  
  next () {
    /*
    Move to next node
    */
    this.node += 1;
    return this.program[this.node];
  }
  
  previous () {
    /*
    Move to previous node
    */
    this.node -= 1;
    return this.program[this.node];
  }
  
  current () {
    /*
    Get current node
    */
    return this.program[this.node];
  }
  
  peek (nodes=1) {
    /*
    Peek the next node
    */
    return this.program[this.node+nodes];
  }
  
  lookBack (nodes=1) {
    /*
    Peek the previous node
    */
    return this.program[this.node-nodes];
  }
  
  checkType (obj) {
    /*
    Get an object's constructor name / type
    */
    return obj.constructor.name;
  }

  toLiteral (obj) {
    /*
    Convert an object to a run-able object, usually a Literal.
    If the argument object is a node or already run-able, it returns it without making any changes.
    */
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

  resolveRun (obj) {
    /*
    Run an object until the final, non-runable value is returned
    */
    while (obj.run != undefined) {
      obj = this.interpretNode(obj);
    }
    return obj;
  }

  interpretNode (node) {
    /*
    Interpret a single node.
    */
    let type = node.constructor.name;

    if (type == "BinaryOperatorNode") {
      let result = this.toLiteral(node.run(this.variables,new Interpreter()));
      return result;
    }
    else if (type == "FuncAssignNode") {
      let name = node.body.name;
      let stats = node.body.statements;
      let args = node.body.args;
      this.variables[name] = new Literal.FunctionLiteral(name,args,stats);
      return new Literal.TextLiteral(name);
    }
    else if (type == "CallNode") {
      let o = node.run(this.variables,new Interpreter());
      return this.toLiteral(o);
    }
    else if (type == "VarAssignNode") {
      let name = node.body.name;
      let value = node.body.value.run(this.variables,new Interpreter());

      value = this.toLiteral(value);
      let mutable = node.body.mutable;
      if (this.variables[name] == undefined || mutable == true) {
        this.variables[name] = value;
        return value;
      } else {
        throw new Error(`At line ${this.body.line}:\nCannot change a constant variable`);
      }
    }
    else if (type == "VarAccessNode") {
      let name = node.body.name;
      if (this.variables[name] != undefined) {
        return this.variables[name];
      } else {
        throw new Error(`At line ${this.body.line}:\nCannot access unknown variable ${name}`)
      }
    }
    else if (type == "TextNode" || type == "IntegerNode") {
      return this.toLiteral(node.run());
    }
    else if (type == "PrintNode") {
      let value = node.run(this.variables,new Interpreter())
      return value;
    }
    else if (["TrueNode","FalseNode","NilNode"].includes(type)) {
      return this.toLiteral(node.run());
    }
    else if (type == "IfChainNode") {
      let o = node.run(this.variables,new Interpreter());
      return this.toLiteral(o);
    }
    else if (type == "ReturnNode") {
      let value = node.run(this.variables,new Interpreter());
      return value;
    }
    else if (type == "ListNode") {
      let value = node.run();
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
  
  
  
  walk (ast) {
    /*
    Interpret a whole AST. Basically this.interpretNode in a while loop.
    */
    this.program = ast;
    console.log("PG " + JSON.stringify(this.program));
    let iterated = -1;
    let outputs = [];
    while (this.peek() != undefined) {
      iterated += 1;
      let node = this.next();
      console.log("ND " + JSON.stringify(node));
      let o = this.interpretNode(node);
      outputs.push(o);
    }
    // return last expression's result
    return outputs[outputs.length - 1];
  }
}
