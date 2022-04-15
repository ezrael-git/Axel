// nodes.js
const Scanner = require("./scanner.js");



class VarAssignNode {
  /*
  Node for when a variable is declared, or assigned to.
  */
  constructor (name, value, mutable, line, bind="main") {
    this.type = "DeclarationExpression";
    this.name = name;
    this.mutable = mutable;
    this.bind = bind;
    this.value = value;
    this.line = line;
  }
  
  run (variables, mode=1) {
    /* 
    Takes in an Object containing the variables for the program and returns an edited version of it containing the information of the variable.
    */
    if (mode == 0) {
      variables[this.name] = this.value;
    } else {
      variables = this.value;
    }
    return variables;
  }
}


class FuncAssignNode {
  /*
  For when a function is declared.
  */
  constructor (name, args, statements, line, bind="main") {
    this.type = "DeclarationExpression";
    this.name = name;
    this.args = args;
    this.bind = bind;
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
