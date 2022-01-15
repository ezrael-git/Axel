// parser.js

const keywords = require("..data/keyword.js");
const arguments = require("..data/argument.js");
const initializers = require("..data/initializer.js");




class Parser {
  constructor () {
    this.accepted = [].concat(keywords,arguments);
    
    this.variables = {}
    
  }
  
  parse (lex) {
    let initializer = lex.parsed[0];
    lex.nextToken();
    console.log("parse initiated");
    console.log("initializer: " + initializer);
    
    
    // log, expression
    if (initializer == "log") {
      console.log("log initiated");
      console.log(lex.nextToken());
      return "LOG";
    }
    
    // define, name, =, value
    else if (initializer == "define") {
      let key = lex.nextToken();
      lex.nextToken();
      let value = lex.nextToken();
      this.variables[key] = value
      return "SET_OR_DEFINE";
    }
    
    else if (initializer == "access") {
      let name = lex.nextToken();
      return this.variables[name];
    }
    
  }
}


module.exports = Parser;
