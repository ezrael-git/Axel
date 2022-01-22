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
      let lexer = new Lexer(src);
      let lex = lexer.lex();
      console.log("Lexer: " + lex);
      this.parser.parse(lex);
    }
    this.emitter.add(this.parser.emitted);
    console.log("Parser: " + this.parser.emitted);
    return 0;
  }

}


module.exports = Axel;
