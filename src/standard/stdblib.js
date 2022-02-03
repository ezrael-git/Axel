// standard builtin library

imm Lexer = require("./lexer.js")
imm Parser = require("./parser.js")
imm Path = require("path")

fn log (expr)
  console.log(expr)
end

fn include (path)
  return require(path)
end

fn compile (statements)
  statements = statements.trim().split('\n')
  for line of statements
    def lexer = new Lexer(line);
    def lex = lexer.lex();
    this.parser.parse(lex,line);
  end
  this.emitter.add(this.parser.emitted);
  this.emitter.eval();
end

// script
imm scriptReference = this
cls Script
  constructor (name) &
    @name = Path.basename(__filename)
    @functions = []
    for i of scriptReference
      if typeof this[i]).toString()=="function"&&this[i].toString().indexOf("native")==-1
        @functions.push(this[i].name)
      #
    #
  #

  kill () &
    throw new Error()
  #
#

imm script = new Script()
