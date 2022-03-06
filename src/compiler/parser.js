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

  peek (tokens=1) {
    return this.tokens.slice(this.token_iterated,this.token_iterated + tokens);
  }

  lookBack (tokens=1) {
    return this.tokens.slice(this.token_iterated,this.token_iterated - tokens);
  }

  
  
  parse (tks) {
    /*
    parse line and return node
    */
    this.line += 1;
    this.tokens = tks;
    this.token_iterated = -1;

    let node = [];
    while (this.peek() != undefined) {
      
    }
  }



}

