const Lexer = require("./compiler/lexer.js");
const Parser = require("./compiler/parser.js");
const Emitter = require("./compiler/emitter.js");

class Axel {

  constructor () {
    this.parser = new Parser();
    this.emitter = new Emitter();

    this.stdblib = `fn log expr
      console.log(expr)
    end`;
  }

  purify (lis) {
    let n = [];
    lis.forEach(function (e) {
      if (e != " " && e != "" && e.length > 0) {
        n.push(e);
      }
    });
    return n;
  }

  program (statements) {
    let log = [];
    statements = statements.trim().split('\n');
    for (let line of statements) {
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
