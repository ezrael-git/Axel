const Lexer = require("./lexer.js");
const Parser = require("./parser.js");

class Axel {

  initialize () {
    this.parser = new Parser();
  }

  program (src) {
    let lex = new Lexer(src);
    let r = this.parser.parse(lex);
    return r
  }

}


module.exports = program;
