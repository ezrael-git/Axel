const fs = require("fs");

const Preprocessor = require("./compiler/preprocessor.js");
const Lexer = require("./compiler/lexer.js");
const Parser = require("./compiler/parser.js");
const Emitter = require("./compiler/emitter.js");

class Axel {

  constructor () {
    this.preprocessor = new Preprocessor();
    this.lexer = new Lexer();
    this.parser = new Parser();
    this.emitter = new Emitter();
    /*
    this.stdblib = fs.readFileSync("./standard/stdblib.js",
    {encoding:'utf8', flag:'r'}
    );
    */
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
    statements = this.preprocessor.process(statements.trim().split('\n'));

    for (let line of statements) {
      let lex = lexer.lex(line);
      this.parser.parse(lex,line);
    }
    this.emitter.add(this.parser.emitted);
    console.log("Axel:");
    this.emitter.eval();
  }

}


module.exports = Axel;
