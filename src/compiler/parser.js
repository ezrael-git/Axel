// parser.js
// generate AST

const Node = require("./nodes.js");
const Scanner = require("./scanner.js");




module.exports = class Parser {
  constructor () {
    this.variables = {};
    this.token_iterated = -1;
    this.tokens = [];
    this.line = 0;
  }

  next () {
    this.token_iterated += 1;
    let n = this.tokens[this.token_iterated];
    return n;
  }

  previous () {
    this.token_iterated -= 1;
    let n = this.tokens[this.token_iterated];
    return n;
  }

  current () {
    return this.tokens[this.token_iterated];
  }

  peek (tokens=1) {
    return this.tokens.slice(this.token_iterated,this.token_iterated + tokens);
  }

  lookBack (tokens=1) {
    return this.tokens.slice(this.token_iterated,this.token_iterated - tokens);
  }

  handleType (token) {
    if (token.type == "STRING") {
      return 
    }
  }

  
  
  parse (tks) {
    /*
    parse line and return node
    */
    this.line += 1;
    this.tokens = tks;
    this.token_iterated = -1;

    let node_tree = [];
    while (this.peek() != undefined) {
      let token = this.next();
      let type = token.type;
      if (type == "PLUS") {
        let lhs = this.lookBack();
        let rhs = this.peek();
        let node = new Node.BinaryOperatorNode(lhs,rhs,"+");
        node_tree.push(node);
      }
      else if (type == "MINUS") {
        let lhs = this.lookBack();
        let rhs = this.peek();
        let node = new Node.BinaryOperatorNode(lhs,rhs,"-");
        node_tree.push(node);
      }
      else if (type == "MULTIPLY") {
        let lhs = this.lookBack();
        let rhs = this.peek();
        let node = new Node.BinaryOperatorNode(lhs,rhs,"*");
        node_tree.push(node);
      }
      else if (type == "DIVIDE") {
        let lhs = this.lookBack();
        let rhs = this.peek();
        let node = new Node.BinaryOperatorNode(lhs,rhs,"/");
        node_tree.push(node);
      }
      else if (type == "DEFINE") {
        if (this.next().type != "EQUALITY") {
          throw new Error(`Expected TokenType to be EQUALITY, got ${this.current().type} instead`);
        }
        let value_token = this.next();
        
      }
    }
  }



}

