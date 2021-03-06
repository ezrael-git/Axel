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
        return result;
      }
      else if (type == "FuncAssignNode") {
        let name = node.body.name;
        let stats = node.body.statements;
        let args = node.body.args;
        this.variables[name] = [args,stats];
        return name;
      }
      else if (type == "CallNode") {
        let o = node.run(this.variables,new Walker());
        return o;
      }
      else if (type == "VarAssignNode") {
        let name = node.body.name;
        let getMethods = (obj) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function')
        console.log("VALUE " + JSON.stringify(node.body.value));
        let value = node.body.value.run();
        let mutable = node.body.mutable;
        if (this.variables[name] == undefined) {
          this.variables[name] = value;
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
        return node.run();
      }
    }
  }
}
