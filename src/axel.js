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
    let n = [];
    lis.forEach(function (e) {
      if (e != " " && e != "" && e.length > 0) {
        n.push(e);
      }
    });
    return n;
  }

  identify_macros (stats) {
    let elem = 0;
    let macros = [];
    let flag = false;
    for (let line of stats) {
      elem += 1;
      if (line.includes("+++")) {
        if (flag == false) {
          flag = true;
        } else {
          flag = false;
        }
      }
      if (flag == true) {
        macros.push(line);
      }
    }
    let prepr = [];
    for (let macro of macros) {
      if (macro != "+++") {
        prepr.push(macro);
      }
    }
    return prepr;
  }

  process_macros (macros) {
    let newlined = macros.join('\n');
    eval(newlined);
  }

  program (statements) {
    let log = [];
    statements = this.stdblib + "\n" + statements;
    statements = statements.trim().split('\n');
    // identify and process macros because they have to run before anything else
    let macros = this.identify_macros(statements);
    this.process_macros(macros);
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
