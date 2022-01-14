// analysis.js
// checks for syntax errors and so on
const Error = require("../exceptions/exception.js");
const Data = require("../data/bundler.js");

class Analyze {
  constructor (code) {
    this.code = code;
    this.pos = 0;
  }
  
  check_err (line) {
    let initializer = line.split(' ')[0];
    // check if unknown initializer
    if (!Data.keywords.includes(initializer)) {
      Error.UnknownInitializer();
    };
  }
  
  analyze () {
    let parsed = this.code.split(';');
    let cls = this
    parsed.forEach(function (line) {
      
      cls.check_err(line);
      
    });
  }
  
  
}
