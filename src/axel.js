const Lexer = require("./lexer.js");
const Parser = require("./parser.js");


function program (src) {
  let lexer = new Lexer(src);
  lexer.parsed.forEach(function (t) {
    console.log(t);
  });
  let parser = new Parser(src,lexer);
  parser.parse();
}


module.exports = program;
