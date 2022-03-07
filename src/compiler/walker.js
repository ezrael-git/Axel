// ast_walker.js


class Walker {
  constructor () {
    this.program = [];
    this.node = -1;
    this.variables = [];
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
    return typeof obj;
  }
  
  
  
  walk (ast) {
    let program = ast["Program"];
    this.program = program;
    while (this.peek() != undefined) {
      let node = this.next();
      
      if (this.checkType(node) == "FuncAssignNode") {
        let name = node.body.name;
        let stats = node.body.statements;
        let args = node.body.args;
        this.variables[name] = [args,stats];
      }
      else if (this.checkType(node) == "CallNode") {
        let o = node.run(this.variables,Walker);
      }
    }
  }
}
