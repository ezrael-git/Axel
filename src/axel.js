const fs = require("fs");

const Preprocessor = require("./compiler/preprocessor.js");
const Lexer = require("./compiler/lexer.js");
const Parser = require("./compiler/parser.js");
const Interpreter = require("./compiler/interpreter.js");

class Axel {

  constructor () {
    this.preprocessor = new Preprocessor();
    this.lexer = new Lexer();
    this.parser = new Parser();
    this.interpreter = new Interpreter();
    /*
    this.stdblib = fs.readFileSync("./standard/stdblib.js",
    {encoding:'utf8', flag:'r'}
    );
    */
  }

  collectMicros (stats) {
    let m = [];
    for (let stat of stats) {
      if (stat.startsWith("#")) {
        m.push(stat);
      }
    }
    return m;
  }



  program (statements) {
    /*
    One-for-all interface to execute Axel code. This function acts as a middleman between the code and the compiler, passing the statements into the compiler and executing it in the end.
    */
    // default settings
    // can be edited through micros
    let preprocessor = true;

    statements = statements.replaceAll(';', '\n').trim().split('\n');
    // execute micros
    let micros = this.collectMicros(statements);
    for (let m of micros) {
      eval(m);
    }

    // compile the statements
    // optional compiling stages are under if statements and can be edited through micros
    if (preprocessor == true) {
      statements = this.preprocessor.process(statements);
    }

    let tokens = this.lexer.process(statements);
    let ast = this.parser.parseProgram(tokens);
    let o = this.interpreter.walk(ast);
    return o
  }

}


module.exports = Axel;
