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

  identify_macros (stats) {
    /*
    Identify the macros in a list of statements.
    */
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
      if (!macro.includes("+++")) {
        prepr.push(macro);
      }
    }
    return prepr;
  }

  process_macros (macros) {
    /*
    Process and execute macros from a list of macros.
    */
    let newlined = macros.join('\n');
    eval(newlined);
  }

  get_functions (stats) {
    /*
    Get names of all functions in a list of statements of Axel code.
    */
    let functions = [];
    for (line of stats) {
      if (line.startsWith("fn ")) {
        line = line.replace("fn ", "");
        let name = "";
        for (char of line) {
          if (char == " " || char == "(") {
            break;
          }
          name += char;
        }
        functions.push(name);
      }
    }
    return functions;
  }

  get_classes (stats) {
    /*
    Get names of all classes in a list of statements of Axel code.
    */
    let classes = [];
    for (let line of stats) {
      if (line.startsWith("cls ")) {
        line = line.replace("cls ", "");
        let name = "";
        for (let char of line) {
          if (char == " " || char == "(") {
            break;
          }
          name += char;
        }
        classes.push(name);
      }
    }
    return classes;
  }


  do_some_replacing (stdlib, code) {
    /*
    Replace the placeholding terms in the stdlib to contain information.
    */
    let n = [];
    let functions = this.get_functions(code);
    let classes = this.get_classes(code);
    for (line of stdblib) {
      line = line.replaceAll("__functions__", functions);
      line = line.replacrAll("__classes__", classes);
      n.push(line);
    }
    return n;
  }

  program (statements) {
    /*
    One-for-all function to execute Axel code. This function acts as a middleman between the code and the compiler, passing the statements into the compiler and executing it in the end.
    */
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
    console.log("Axel:");
    this.emitter.eval();
  }

}


module.exports = Axel;
