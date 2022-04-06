// nodes.js
const Scanner = require("./scanner.js");



class VarAssignNode {
  /*
  Node for when a variable is declared, or assigned to.
  */
  constructor (name, mutable, value, line) {
    this.type = "DeclarationExpression";
    this.name = name;
    this.mutable = mutable;
    this.value = value;
    this.line = line;
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
  constructor (name, args, statements, line) {
    this.type = "DeclarationExpression";
    this.name = name;
    this.args = args;
    this.statements = statements;
    this.line = line;
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
