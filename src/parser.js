// parser.js

const keywords = require("./keyword.js");
const arguments = require("./argument.js");
const initializers = require("./initializer.js");




class Parser {
  constructor (src,lexical) {
    this.source = src;
    this.lex = lexical;
    this.accepted = [].concat(keywords,arguments);
    
    this.variables = {}
    
  }
  
  parse () {
    let lex = this.lex;
    let initializer = lex.nextToken();
    if (!initializers.includes(initializer)) {
      return false
    }
    
    // log, expression
    else if (initializer == "log") {
      console.log(lex.nextToken());
    }
    
    // define, name, =, value
    else if (initializer == "define") {
      let key = lex.nextToken();
      lex.nextToken();
      let value = lex.nextToken();
      this.variables[key] = value
    }
    
    else if (initializer == "access") {
      let name = lex.nextToken();
      return this.variables[name];
    }
    
  }
}


module.exports = Parser;
