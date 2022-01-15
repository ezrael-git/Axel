// parser.js

const keywords = require("../data/keyword.js");
const arguments = require("../data/argument.js");
const initializers = require("../data/initializer.js");




class Parser {
  constructor () {
    this.accepted = [].concat(keywords,arguments);
    
    this.variables = {"initialized": true}
    
  }

  _save(arg, starter, stoppers) {
    let saved = "";
    let saving = false
    arg.split('').forEach(function (c) {

      if (c == starter) {
        saving = true
      };

      if (stoppers.includes(c)) {
        saving = false
      };

      if (saving == true) {
        saved += c
      };
    };
    return saved;
  }
  
  parse (lex) {
    let line = lex.source;
    // translating to JS
    // let's first replace all the keywords with their JS correspondents
    for (const key in keywords) {
      let val = keywords[key];
      line = line.replaceAll(key, val);
    };

    // add variable declarations to this.variables
    if (line.includes("@")) {
      let temp = line.replaceAll('@', "this.variables['");
      temp = temp.replaceAll('=', "'] = ");
      line = temp;
    };

    // replace accessed variables with their values
    let stoppers = [' ', ')', '('] // all the letters that cannot be used in a variable name
    if (line.includes('#')) {



      let parsed = this._save(line, "#", stoppers);
      line = line.replaceAll(saved, this.variables[saved]);

    };

    // now we can run the line
    console.log("parsed: " + line);
    eval(line);
    
  }
}


module.exports = Parser;
