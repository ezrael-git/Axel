const Lexer = require("./compiler/lexer.js");
const Parser = require("./compiler/parser.js");
const Emitter = require("./compiler/emitter.js");

class Axel {

  constructor () {
    this.parser = new Parser();
    this.emitter = new Emitter();
  }

  remove_emp (lis) {
    let n = [];
    lis.forEach(function (e) {
      if (e != " " && e != "" && e.length > 0) {
        n.push(e.replaceAll(" ", ""));
      }
    });
    return n;
  }

  program (src) {
    let strp = src.split(';');
    strp = this.remove_emp(strp);
    let log = [];
    for (let line of strp) {
      console.log("LINE " + line);
      let lexer = new Lexer(line);
      let lex = lexer.lex();
      this.parser.parse(lex,line);
    }
    this.emitter.add(this.parser.emitted);
    console.log("Parser: " + this.parser.emitted);
    console.log("Emitter:");
    this.emitter.eval();
  }

}


module.exports = Axel;
