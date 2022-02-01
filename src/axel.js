const fs = require("fs");

const Preprocesser = require("./compiler/preprocesser.js");
const Lexer = require("./compiler/lexer.js");
const Parser = require("./compiler/parser.js");
const Emitter = require("./compiler/emitter.js");

class Axel {

  constructor () {
    this.preprocessor = new Preprocesser();
    this.parser = new Parser();
    this.emitter = new Emitter();

    this.stdblib = fs.readFileSync("./standard/stdblib.js",
    {encoding:'utf8', flag:'r'}
    );
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
    statements = this.stdblib + "\n" + statements;
    statements = statements.trim().split('\n');
    for (let line of statements) {
      line = this.preprocesser.process(line);
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
