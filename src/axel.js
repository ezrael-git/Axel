const Lexer = require("./lexer.js");
const Parser = require("./parser.js");

class Axel {

  initialize () {
    this.parser = new Parser();
  }

  program (src) {
    let strp = src.split(';');
    let log = [];
    strp.forEach(function (line) {
      let lex = new Lexer(line);
      let r = this.parser.parse(lex);
      log.push(r);
    }
    return log;
  }

}


module.exports = Axel;
