// walker.js


module.exports = class Walker {
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
    return obj.constructor.name;
  }
  
  
  
  walk (ast) {
    let program = ast["Program"];
    this.program = program;
    while (this.peek() != undefined) {
      let node = this.next();
      let type = this.checkType(node);
      
      if (type == "BinaryOperatorNode") {
        let result = node.run();
        console.log("walk result: " + result);
      }
      else if (type == "FuncAssignNode") {
        let name = node.body.name;
        let stats = node.body.statements;
        let args = node.body.args;
        this.variables[name] = [args,stats];
      }
      else if (type == "CallNode") {
        let o = node.run(this.variables,Walker);
      }
    }
  }
}
