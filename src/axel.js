const Lexer = require("./compiler/lexer.js");
const Parser = require("./compiler/parser.js");
const Emitter = require("./compiler/emitter.js");

class Axel {

  constructor () {
    this.parser = new Parser();
    this.emitter = new Emitter();
  }

  program (src) {
    let strp = src.split(';');
    let log = [];
    for (let line of strp) {
      let lex = new Lexer(line);
      let r = parser.parse(lex);
      log.push(r);
    }
    emitter.add(parser.emitted);
    return log;
  }

}


module.exports = Axel;
