const Lexer = require("./lexer.js");
const Parser = require("./parser.js");


function program (src) {
  let lexer = new Lexer(src);
  let parser = new Parser(src,lexer);
  parser.parse();
}


module.exports = program;
