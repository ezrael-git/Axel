const fs = require("fs");

const Preprocesser = require("./compiler/preprocesser.js");
const Lexer = require("./compiler/lexer.js");
const Parser = require("./compiler/parser.js");
const Emitter = require("./compiler/emitter.js");

class Axel {

  constructor () {
    this.preprocesser = new Preprocesser();
    this.parser = new Parser();
    this.emitter = new Emitter();

    this.stdblib = fs.readFileSync("./standard/stdblib.js",
    {encoding:'utf8', flag:'r'}
    );
  }

  purify (lis) {
    /*
    Purify a list, removing unnecessary items such as empty elements and whitespaces.
    */
    let n = [];
    lis.forEach(function (e) {
      if (e != " " && e != "" && e.length > 0) {
        n.push(e);
      }
    });
    return n;
  }


  program (statements) {
    /*
    One-for-all function to execute Axel code. This function acts as a middleman between the code and the compiler, passing the statements into the compiler and executing it in the end.
    */
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
    console.log("Axel:");
    this.emitter.eval();
  }

}


module.exports = Axel;
