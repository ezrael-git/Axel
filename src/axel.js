const Lexer = require("./compiler/lexer.js");
const Parser = require("./compiler/parser.js");

class Axel {

  initialize () {
    this.parser = new Parser();
  }

  program (src) {
    let strp = src.split(';');
    let log = [];
    let parser = this.parser;
    strp.forEach(function (line) {
      let lex = new Lexer(line);
      let r = parser.parse(lex);
      log.push(r);
    });
    return log;
  }

}


module.exports = Axel;
