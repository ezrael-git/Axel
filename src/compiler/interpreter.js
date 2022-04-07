// interpreter.js
// interpret nodes and ASTs

const Literal = require("./literals.js");
const Scanner = require("./scanner.js");

module.exports = class Interpreter {
  constructor () {
    this.program = [];
    this.node = -1;
    this.variables = {};
    this.scanner = new Scanner();
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
      return new Literal.StringLiteral(obj);
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

    // handle...
    // binary expressions
    if (type == "BinaryOperatorLiteral") {
      let result = this.toLiteral(node.run(this.variables,new Interpreter()));
      return result;
    }
    // function assignment
    else if (type == "FuncAssignNode") {
      let name = node.name;
      let stats = node.statements;
      let args = node.args;
      this.variables[name] = new Literal.FunctionLiteral(name,args,stats,node.line);
      return new Literal.StringLiteral(name,node.line);
    }
    // function calls
    else if (type == "CallLiteral") {
      let o = node.run(this.variables,new Interpreter());
      return this.toLiteral(o);
    }
    // variable assignment
    else if (type == "VarAssignNode") {
      let name = node.name;
      let value = node.value.run(this.variables,new Interpreter());

      value = this.toLiteral(value);
      let mutable = node.mutable;
      if (this.variables[name] == undefined || mutable == true) {
        this.variables[name] = value;
        return value;
      } else {
        throw new Error(`At line ${node.line}:\nCannot change a constant variable`);
      }
    }
    // variable accesses
    else if (type == "VariableLiteral") {
      let name = node.name;
      if (this.variables[name] != undefined) {
        return this.variables[name];
      } else {
        throw new Error(`At line ${node.line}:\nCannot access unknown variable ${name}`)
      }
    }
    // strings/integers
    else if (type == "StringLiteral" || type == "IntegerLiteral") {
      return this.toLiteral(node.run());
    }
    // print keyword
    else if (type == "PrintLiteral") {
      let value = node.run(this.variables,new Interpreter())
      return value;
    }
    // boolean literals
    else if (["TrueLiteral","FalseLiteral","NilLiteral"].includes(type)) {
      return this.toLiteral(node.run());
    }
    // if chain
    else if (type == "IfChainLiteral") {
      let o = node.run(this.variables,new Interpreter());
      return this.toLiteral(o);
    }
    // return expressions
    else if (type == "ReturnLiteral") {
      let value = node.run(this.variables,new Interpreter());
      return value;
    }
    // arrays
    else if (type == "ArrayLiteral") {
      let value = node.run();
      return value;
    }
    // other literals
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
