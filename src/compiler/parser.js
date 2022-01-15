// parser.js

const keywords = require("../data/keyword.js");
const arguments = require("../data/argument.js");
const initializers = require("../data/initializer.js");




class Parser {
  constructor () {
    this.accepted = [].concat(keywords,arguments);
    
    this.variables = {}
    
  }
  
  parse (lex) {
    let line = lex.source;
    // translating to JS
    // let's first replace all the keywords with their JS correspondents
    for (const key in keywords) {
      let val = keywords[key];
      line.replaceAll(key, val);
    };

    // now we can run the line
    console.log(line);
    eval(line);
    
  }
}


module.exports = Parser;
