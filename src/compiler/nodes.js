// nodes.js
const Scanner = require("./scanner.js");



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

module.exports = {
  VarAssignNode:VarAssignNode,
  FuncAssignNode:FuncAssignNode
}
